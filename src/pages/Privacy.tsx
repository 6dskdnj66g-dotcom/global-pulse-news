import React from 'react';
import Layout from '../components/layout/Layout';
import SEO from '../components/common/SEO';
import { useTranslation } from 'react-i18next';
import { Shield, Lock, Eye, Database, Mail } from 'lucide-react';

const Privacy: React.FC = () => {
    const { i18n } = useTranslation();
    const isRtl = i18n.language === 'ar';

    return (
        <Layout>
            <SEO title={isRtl ? 'سياسة الخصوصية' : 'Privacy Policy'} />
            <div className={`min-h-screen py-20 px-4 ${isRtl ? 'text-right' : 'text-left'}`}>
                <div className="container max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900/30 mb-6">
                            <Shield className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900 dark:text-white">
                            {isRtl ? 'سياسة الخصوصية' : 'Privacy Policy'}
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400">
                            {isRtl ? 'آخر تحديث: يناير 2026' : 'Last updated: January 2026'}
                        </p>
                    </div>

                    <div className="space-y-8 text-slate-700 dark:text-slate-300">
                        <section className="glass-panel p-6 rounded-xl">
                            <div className="flex items-center gap-3 mb-4">
                                <Lock className="w-6 h-6 text-indigo-500" />
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                    {isRtl ? 'جمع المعلومات' : 'Information Collection'}
                                </h2>
                            </div>
                            <p className="leading-relaxed">
                                {isRtl
                                    ? 'نحن نجمع المعلومات التي تقدمها لنا مباشرة، مثل عند إنشاء حساب أو الاشتراك في النشرة الإخبارية. قد نجمع أيضًا معلومات تلقائيًا عند استخدامك لموقعنا.'
                                    : 'We collect information you provide directly to us, such as when you create an account or subscribe to our newsletter. We may also collect information automatically when you use our website.'}
                            </p>
                        </section>

                        <section className="glass-panel p-6 rounded-xl">
                            <div className="flex items-center gap-3 mb-4">
                                <Eye className="w-6 h-6 text-indigo-500" />
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                    {isRtl ? 'كيف نستخدم معلوماتك' : 'How We Use Your Information'}
                                </h2>
                            </div>
                            <p className="leading-relaxed">
                                {isRtl
                                    ? 'نستخدم المعلومات التي نجمعها لتقديم خدماتنا وتحسينها، وإرسال التحديثات والأخبار، وتخصيص تجربتك على موقعنا.'
                                    : 'We use the information we collect to provide and improve our services, send you updates and news, and personalize your experience on our website.'}
                            </p>
                        </section>

                        <section className="glass-panel p-6 rounded-xl">
                            <div className="flex items-center gap-3 mb-4">
                                <Database className="w-6 h-6 text-indigo-500" />
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                    {isRtl ? 'حماية البيانات' : 'Data Protection'}
                                </h2>
                            </div>
                            <p className="leading-relaxed">
                                {isRtl
                                    ? 'نحن نتخذ تدابير أمنية معقولة لحماية معلوماتك الشخصية من الوصول غير المصرح به أو التغيير أو الإفصاح أو التدمير.'
                                    : 'We take reasonable security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction.'}
                            </p>
                        </section>

                        <section className="glass-panel p-6 rounded-xl">
                            <div className="flex items-center gap-3 mb-4">
                                <Mail className="w-6 h-6 text-indigo-500" />
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                    {isRtl ? 'اتصل بنا' : 'Contact Us'}
                                </h2>
                            </div>
                            <p className="leading-relaxed">
                                {isRtl
                                    ? 'إذا كانت لديك أي أسئلة حول سياسة الخصوصية هذه، يرجى التواصل معنا عبر نموذج الاتصال في أسفل الصفحة.'
                                    : 'If you have any questions about this Privacy Policy, please contact us through the contact form at the bottom of the page.'}
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Privacy;
