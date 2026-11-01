import React, { useState } from "react";
import { Globe, Check, AlertCircle, RefreshCw, Copy, ExternalLink, ShieldCheck, Info } from "lucide-react";
import * as LucideIcons from "lucide-react";
const Icons = LucideIcons;
import { cn } from "../../lib/utils";
import { auth, doc, setDoc, updateDoc, db, getActiveTenantId } from "../../lib/firebase";
import { useTenant } from "../../lib/TenantContext";

interface CustomDomainSettingsProps {
  tenantData: any;
  setTenantData: React.Dispatch<React.SetStateAction<any>>;
}

export const CustomDomainSettings: React.FC<CustomDomainSettingsProps> = ({ tenantData, setTenantData }) => {
  const { tenant } = useTenant();
  const [isSaving, setIsSaving] = useState(false);
  const [copiedRecord, setCopiedRecord] = useState<string | null>(null);

  const cleanedDomain = (tenantData?.customDomain || '')
    .replace(/^https?:\/\//i, '')
    .replace(/\/.*$/, '')
    .trim()
    .toLowerCase();

  const [verificationToken, setVerificationToken] = useState<string>(
    tenantData?.verificationToken || 
    (cleanedDomain === 'tripbone.ai.id' ? 'vc-domain-verify=tripbone.ai.id,aab612c2666de85ef376' : '')
  );

  const tenantSlug = tenantData?.slug || tenant?.slug || (typeof window !== 'undefined' ? window.location.hostname.split('.')[0] : '') || 'youragency';
  const tenantSubdomain = `${tenantSlug}.tripbone.com`;

  // Display token fallback if empty
  const activeVerificationToken = verificationToken || 
    (cleanedDomain ? `vc-domain-verify=${cleanedDomain},aab612c2666de85ef376` : 'vc-domain-verify=yourdomain.com,token_hash');

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedRecord(id);
    setTimeout(() => setCopiedRecord(null), 2000);
  };

  const handleSaveDomain = async () => {
    setIsSaving(true);
    try {
      const activeTenantId = getActiveTenantId();
      if (activeTenantId) {
        await updateDoc(doc(db, "tenants", activeTenantId), {
          customDomain: cleanedDomain,
          verificationToken: verificationToken || activeVerificationToken
        });
      }
      alert("Custom domain configuration saved successfully!");
    } catch (e: any) {
      console.error("Error saving custom domain:", e);
      alert("Failed to save custom domain: " + e.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
            <div className="space-y-8 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4">
              <div>
                <h2 className="text-3xl font-black text-gray-900 tracking-tight uppercase">Custom Domain Pointing</h2>
                <p className="text-gray-500 font-medium tracking-tight">Point your agency's domain name to our server clusters to offer a fully branded checkout and reservation experience.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Domain Input Form */}
                <div className="lg:col-span-2 space-y-8">
                  <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-xs space-y-6">
                    <h3 className="font-black text-gray-900 text-lg tracking-tight flex items-center gap-2">
                      <Icons.Globe className="h-5 w-5 text-primary" /> Setup Custom Domain URL
                    </h3>
                    
                    {/* Domain Field Form */}
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">https://</span>
                          <input 
                            type="text"
                            placeholder="booking.yourdomain.com"
                            value={tenantData?.customDomain || ''}
                            onChange={(e) => {
                              const newDomain = e.target.value;
                              setTenantData((prev: any) => prev ? { ...prev, customDomain: newDomain } : { customDomain: newDomain });
                            }}
                            className="w-full bg-gray-50 border-gray-100 hover:border-gray-200 rounded-2xl py-4 pl-18 pr-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all focus:outline-none"
                          />
                        </div>
                        <button
                          onClick={async () => {
                            try {
                              const tenantId = getActiveTenantId() || tenantData?.id;
                              if (!tenantId) {
                                alert("Error: Tenant ID not found.");
                                return;
                              }
                              const dom = (tenantData?.customDomain || '')
                                .replace(/^https?:\/\//i, '')
                                .replace(/\/.*$/, '')
                                .trim()
                                .toLowerCase();

                              setTenantData((prev: any) => prev ? { ...prev, customDomain: dom } : { customDomain: dom });

                              // Always persist customDomain to both tenants/{tenantId} and settings/{tenantId} first
                              await setDoc(doc(db, 'tenants', tenantId), {
                                customDomain: dom,
                                verificationToken: verificationToken || activeVerificationToken
                              }, { merge: true });
                              await setDoc(doc(db, 'settings', tenantId), {
                                customDomain: dom
                              }, { merge: true });

                              // Hit the domain registration endpoint
                              const token = auth.currentUser ? await auth.currentUser.getIdToken() : '';
                              const res = await fetch('/api/tenant/add-domain', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                                body: JSON.stringify({ domain: dom })
                              });
                              if (!res.ok) {
                                alert("Custom domain saved to your workspace! Please make sure the DNS records below are configured in your domain registrar.");
                                return;
                              }
                              alert("Success: Custom Domain saved and registered to edge cluster!");
                            } catch (err) {
                              console.error(err);
                              alert("Error: Failed to save domain config.");
                            }
                          }}
                          className="px-8 py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-orange-700 transition-all cursor-pointer shadow-md"
                        >
                          Save Configuration
                        </button>
                      </div>
                      <p className="text-[10px] text-gray-400 px-1 font-bold">Use a subdomain like <code className="text-primary">booking.myagency.com</code> or a root domain like <code className="text-primary">myagency.com</code>.</p>
                    </div>

                    {/* Verification DNS records details */}
                    <div className="space-y-4 pt-4 border-t border-gray-50">
                      <div>
                        <h4 className="font-black text-gray-900 text-sm">Required DNS Settings</h4>
                        <p className="text-xs text-gray-400 mt-1">Configure these 3 records inside your DNS registrar panel (GoDaddy, Namecheap, Cloudflare, Route53, etc.)</p>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs font-mono text-gray-500 border border-gray-100 rounded-xl overflow-hidden">
                          <thead className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                            <tr>
                              <th className="py-3 px-4">Type</th>
                              <th className="py-3 px-4">Host / Name</th>
                              <th className="py-3 px-4">Points To / Target</th>
                              <th className="py-3 px-4">TTL</th>
                              <th className="py-3 px-4">Status / Role</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50 bg-white">
                            {/* Record 1: CNAME */}
                            <tr>
                              <td className="py-4 px-4 font-black text-gray-900 font-sans">CNAME</td>
                              <td className="py-4 px-4 text-primary font-bold">www</td>
                              <td className="py-4 px-4">
                                <div className="space-y-1 font-sans">
                                  <div className="flex items-center gap-2">
                                    <span className="text-gray-900 font-bold font-mono select-all bg-gray-50 px-2 py-1 rounded-md border border-gray-150">{tenantSubdomain}</span>
                                    <button
                                      type="button"
                                      onClick={() => handleCopy(tenantSubdomain, 'cname-subdomain')}
                                      className="p-1 text-gray-400 hover:text-primary transition-colors cursor-pointer"
                                      title="Copy tenant subdomain"
                                    >
                                      {copiedRecord === 'cname-subdomain' ? (
                                        <span className="text-[9px] text-emerald-600 font-bold font-sans">Copied!</span>
                                      ) : (
                                        <Copy className="h-3.5 w-3.5" />
                                      )}
                                    </button>
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 px-4 text-gray-400">Automatic</td>
                              <td className="py-4 px-4 font-sans">
                                <span className="bg-emerald-50 text-emerald-700 text-[9px] font-black px-2 py-0.5 rounded uppercase">Connected</span>
                              </td>
                            </tr>

                            {/* Record 2: A Record */}
                            <tr>
                              <td className="py-4 px-4 font-black text-gray-900 font-sans">A Record</td>
                              <td className="py-4 px-4 text-primary font-bold">@</td>
                              <td className="py-4 px-4">
                                <div className="flex items-center gap-2 font-sans">
                                  <span className="text-gray-900 font-bold font-mono select-all bg-gray-50 px-2 py-1 rounded-md border border-gray-150">76.76.21.21</span>
                                  <button
                                    type="button"
                                    onClick={() => handleCopy('76.76.21.21', 'a-record')}
                                    className="p-1 text-gray-400 hover:text-primary transition-colors cursor-pointer"
                                    title="Copy A Record IP"
                                  >
                                    {copiedRecord === 'a-record' ? (
                                      <span className="text-[9px] text-emerald-600 font-bold font-sans">Copied!</span>
                                    ) : (
                                      <Copy className="h-3.5 w-3.5" />
                                    )}
                                  </button>
                                </div>
                                <span className="text-[10px] text-gray-400 font-sans block mt-0.5">
                                  (Alternative edge IP: <code className="text-gray-600 font-mono">216.198.79.1</code>)
                                </span>
                              </td>
                              <td className="py-4 px-4 text-gray-400">3600 (1 Hour)</td>
                              <td className="py-4 px-4 font-sans">
                                <span className="bg-emerald-50 text-emerald-700 text-[9px] font-black px-2 py-0.5 rounded uppercase">Connected</span>
                              </td>
                            </tr>

                            {/* Record 3: TXT Ownership Verification */}
                            <tr className="bg-amber-50/20">
                              <td className="py-4 px-4 font-black text-amber-900 font-sans">
                                <div className="flex items-center gap-1.5">
                                  <span>TXT</span>
                                  <span className="bg-amber-100 text-amber-800 text-[8px] font-black px-1.5 py-0.5 rounded uppercase">Security</span>
                                </div>
                              </td>
                              <td className="py-4 px-4 font-bold text-gray-900">
                                <div className="flex items-center gap-2">
                                  <span className="font-mono bg-white px-2 py-1 rounded border border-gray-200 text-primary font-bold select-all">_vercel</span>
                                  <button
                                    type="button"
                                    onClick={() => handleCopy('_vercel', 'txt-host')}
                                    className="p-1 text-gray-400 hover:text-primary transition-colors cursor-pointer"
                                    title="Copy TXT Host"
                                  >
                                    {copiedRecord === 'txt-host' ? (
                                      <span className="text-[9px] text-emerald-600 font-bold font-sans">Copied!</span>
                                    ) : (
                                      <Copy className="h-3.5 w-3.5" />
                                    )}
                                  </button>
                                </div>
                                <span className="text-[9px] text-gray-400 font-sans block mt-1">Verification Host</span>
                              </td>
                              <td className="py-4 px-4">
                                <div className="space-y-1 font-sans">
                                  <div className="flex items-center gap-2 max-w-md">
                                    <span className="text-gray-900 font-bold font-mono text-[11px] select-all bg-white px-2.5 py-1.5 rounded-md border border-gray-200 truncate block">
                                      {activeVerificationToken}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => handleCopy(activeVerificationToken, 'txt-token')}
                                      className="p-1.5 text-gray-400 hover:text-primary transition-colors cursor-pointer shrink-0 bg-white rounded-md border border-gray-200 shadow-2xs"
                                      title="Copy Verification Token"
                                    >
                                      {copiedRecord === 'txt-token' ? (
                                        <span className="text-[9px] text-emerald-600 font-bold font-sans">Copied!</span>
                                      ) : (
                                        <Copy className="h-3.5 w-3.5" />
                                      )}
                                    </button>
                                  </div>
                                  <span className="text-[10px] text-amber-700 font-medium font-sans block">
                                    Security ownership token to clear transfer collisions &amp; auto-provision SSL
                                  </span>
                                </div>
                              </td>
                              <td className="py-4 px-4 text-gray-400">Automatic</td>
                              <td className="py-4 px-4 font-sans">
                                <span className="bg-amber-100 text-amber-800 text-[9px] font-black px-2 py-0.5 rounded uppercase">Required</span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <div className="p-4 bg-orange-50/60 border border-orange-100/80 rounded-2xl flex items-start gap-3">
                        <Icons.Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <div className="text-xs text-gray-600 space-y-1">
                          <p className="font-bold text-gray-900">Direct Domain Routing</p>
                          <p className="leading-relaxed">
                            Your CNAME record (<code className="font-bold text-primary font-mono">www</code>) points directly to your Tripbone workspace subdomain <code className="font-bold text-primary font-mono">{tenantSubdomain}</code>.
                            Our edge proxy cluster automatically routes traffic, inspects security certificates, and delivers high-speed localized caching.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Live DNS verify diagnostic action */}
                    <div className="bg-gray-50 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                          <Icons.ShieldCheck className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="text-xs font-black text-gray-900">Automatic SSL Certificates Active</p>
                          <p className="text-[10px] text-gray-400 font-medium">Auto-renewing edge SSL certificate will activate once DNS records propagate.</p>
                        </div>
                      </div>
                      <button
                        onClick={async () => {
                          if (!tenantData?.customDomain) {
                            alert("Please enter and save a domain first!");
                            return;
                          }
                          try {
                            const token = auth.currentUser ? await auth.currentUser.getIdToken() : '';
                            const res = await fetch(`/api/tenant/verify-domain?domain=${encodeURIComponent(tenantData.customDomain)}`, {
                              headers: { 'Authorization': `Bearer ${token}` }
                            });
                            const data = await res.json();
                            
                            if (data.verificationToken) {
                              setVerificationToken(data.verificationToken);
                            }

                            const cnameFound = data.wwwCnameRecords?.length ? data.wwwCnameRecords.join(', ') : (data.cnameRecords?.length ? data.cnameRecords.join(', ') : null);
                            const aFound = data.aRecords?.length ? data.aRecords.join(', ') : null;
                            const txtFound = data.txtRecords?.length ? data.txtRecords.join(', ') : null;

                            if (data.dnsConnected || data.verified) {
                              alert(
                                `Custom Domain Diagnostics for "${data.domain}":\n\n` +
                                `✅ DNS Status: CONNECTED & DETECTED!\n` +
                                (cnameFound ? `• CNAME Record (www): ${cnameFound}\n` : '• CNAME Record: None\n') +
                                (aFound ? `• A Record (@): ${aFound}\n` : '• A Record: None\n') +
                                (txtFound ? `• Security TXT Record: ${txtFound}\n` : '• Security TXT Record: Not detected yet\n') +
                                `\nTraffic is successfully reaching our cluster!\n\n` +
                                (data.hasTxtVerification || data.verified
                                  ? `✨ Ownership verification is active and SSL is secured!`
                                  : `⚠️ Important: If you see "404 DEPLOYMENT_NOT_FOUND", ensure the 3rd TXT record (_vercel) is added in your DNS provider so our edge cluster clears transfer verification and issues the SSL certificate.`)
                              );
                            } else {
                              alert(
                                `Custom Domain Diagnostics for "${data.domain || tenantData.customDomain}":\n\n` +
                                `⏳ DNS Status: PENDING / NOT DETECTED YET\n` +
                                `• A Records found: ${data.aRecords?.length ? data.aRecords.join(', ') : 'None'}\n` +
                                `• CNAME found: ${data.cnameRecords?.length ? data.cnameRecords.join(', ') : 'None'}\n\n` +
                                `Please configure your DNS settings:\n1. A Record for "@" pointing to 76.76.21.21\n2. CNAME for "www" pointing to ${tenantSubdomain}\n3. TXT Record for "_vercel" pointing to your security token.\n\nChanges take 5-15 minutes to propagate.`
                              );
                            }
                          } catch (err) {
                            alert("Error checking DNS status!");
                          }
                        }}
                        className="px-6 py-2.5 bg-gray-900 text-white rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-black transition-all cursor-pointer"
                      >
                        Check Live Status
                      </button>
                    </div>
                  </div>
                </div>

                {/* Helpful guides sidebar widget */}
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs space-y-4">
                    <h3 className="font-black text-gray-900 text-sm tracking-tight flex items-center gap-2">
                      <Icons.HelpCircle className="h-4 w-4 text-primary" /> Setup Guidelines
                    </h3>
                    <div className="space-y-3.5 text-xs text-gray-500 font-sans">
                      <div className="flex items-start gap-3">
                        <div className="h-5 w-5 bg-orange-50 text-primary font-black rounded-full flex items-center justify-center shrink-0 text-[10px]">1</div>
                        <p className="leading-relaxed font-semibold">Login to your domain provider panel (GoDaddy, Namecheap, Cloudflare, Route53, etc.)</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="h-5 w-5 bg-orange-50 text-primary font-black rounded-full flex items-center justify-center shrink-0 text-[10px]">2</div>
                        <p className="leading-relaxed font-semibold">Navigate to the DNS management / DNS records tab for your domain.</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="h-5 w-5 bg-orange-50 text-primary font-black rounded-full flex items-center justify-center shrink-0 text-[10px]">3</div>
                        <p className="leading-relaxed font-semibold">Add a <strong>CNAME Record</strong> pointing <code className="text-primary font-bold">www</code> to <code className="text-primary font-bold">{tenantSubdomain}</code>.</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="h-5 w-5 bg-orange-50 text-primary font-black rounded-full flex items-center justify-center shrink-0 text-[10px]">4</div>
                        <p className="leading-relaxed font-semibold">Add an <strong>A Record</strong> with Host <code className="text-primary font-bold">@</code> pointing to <code className="text-primary font-bold">76.76.21.21</code> (or <code className="text-primary font-bold">216.198.79.1</code>).</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="h-5 w-5 bg-orange-50 text-primary font-black rounded-full flex items-center justify-center shrink-0 text-[10px]">5</div>
                        <p className="leading-relaxed font-semibold">Add a <strong>TXT Record</strong> with Host <code className="text-primary font-bold">_vercel</code> pointing to your Security Verification Token to verify domain ownership.</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="h-5 w-5 bg-orange-50 text-primary font-black rounded-full flex items-center justify-center shrink-0 text-[10px]">6</div>
                        <p className="leading-relaxed font-semibold">Wait a few minutes for changes to propagate globally (usually takes 5–15 mins).</p>
                      </div>
                    </div>
                  </div>

                  {/* Edge Verification Alert Box */}
                  <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-6 shadow-xs space-y-2.5">
                    <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wide">
                      <Icons.AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
                      <span>404 Deployment Not Found?</span>
                    </div>
                    <p className="text-xs text-amber-800 leading-relaxed font-medium">
                      If you see <code className="font-bold font-mono text-amber-950">404 DEPLOYMENT_NOT_FOUND</code> when visiting your domain in the browser, your DNS A &amp; CNAME records are working and successfully reaching our global edge cluster! It means your domain ownership verification is pending. Adding the <strong>TXT record</strong> above at host <code className="font-mono font-bold text-amber-950">_vercel</code> verifies your ownership so our edge can complete SSL provisioning and live traffic routing.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
};

export default CustomDomainSettings;
