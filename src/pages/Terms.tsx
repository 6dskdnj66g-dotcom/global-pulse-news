import React from 'react';
import Layout from '../components/layout/Layout';
import SEO from '../components/common/SEO';
import { useTranslation } from 'react-i18next';
import { FileText, Users, AlertTriangle, Scale, CheckCircle } from 'lucide-react';

const Terms: React.FC = () => {
    const { i18n } = useTranslation();
    const isRtl = i18n.language === 'ar';

    return (
        <Layout>
            <SEO title={isRtl ? 'شروط الاستخدام' : 'Terms of Service'} />
            <div className={`min-h-screen py-20 px-4 ${isRtl ? 'text-right' : 'text-left'}`}>
                <div className="container max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/30 mb-6">
                            <FileText className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900 dark:text-white">
                            {isRtl ? 'شروط الاستخدام' : 'Terms of Service'}
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400">
                            {isRtl ? 'آخر تحديث: يناير 2026' : 'Last updated: January 2026'}
                        </p>
                    </div>

                    <div className="space-y-8 text-slate-700 dark:text-slate-300">
                        <section className="glass-panel p-6 rounded-xl">
                            <div className="flex items-center gap-3 mb-4">
                                <CheckCircle className="w-6 h-6 text-purple-500" />
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                    {isRtl ? 'قبول الشروط' : 'Acceptance of Terms'}
                                </h2>
                            </div>
                            <p className="leading-relaxed">
                                {isRtl
                                    ? 'باستخدام موقع Global Pulse، فإنك توافق على الالتزام بشروط الاستخدام هذه. إذا كنت لا توافق على هذه الشروط، يرجى عدم استخدام الموقع.'
                                    : 'By using Global Pulse website, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the website.'}
                            </p>
                        </section>

                        <section className="glass-panel p-6 rounded-xl">
                            <div className="flex items-center gap-3 mb-4">
                                <Users className="w-6 h-6 text-purple-500" />
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                    {isRtl ? 'سلوك المستخدم' : 'User Conduct'}
                                </h2>
                            </div>
                            <p className="leading-relaxed">
                                {isRtl
                                    ? 'يجب على المستخدمين التصرف بمسؤولية واحترام عند استخدام خدماتنا. يحظر أي سلوك مسيء أو غير قانوني أو ضار.'
                                    : 'Users must behave responsibly and respectfully when using our services. Any abusive, illegal, or harmful behavior is prohibited.'}
                            </p>
                        </section>

                        <section className="glass-panel p-6 rounded-xl">
                            <div className="flex items-center gap-3 mb-4">
                                <AlertTriangle className="w-6 h-6 text-purple-500" />
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                    {isRtl ? 'إخلاء المسؤولية' : 'Disclaimer'}
                                </h2>
                            </div>
                            <p className="leading-relaxed">
                                {isRtl
                                    ? 'يتم توفير المحتوى الإخباري من مصادر خارجية موثوقة. نحن لسنا مسؤولين عن دقة أو اكتمال المعلومات المقدمة من هذه المصادر.'
                                    : 'News content is provided from trusted external sources. We are not responsible for the accuracy or completeness of information provided by these sources.'}
                            </p>
                        </section>

                        <section className="glass-panel p-6 rounded-xl">
                            <div className="flex items-center gap-3 mb-4">
                                <Scale className="w-6 h-6 text-purple-500" />
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                    {isRtl ? 'الملكية الفكرية' : 'Intellectual Property'}
                                </h2>
                            </div>
                            <p className="leading-relaxed">
                                {isRtl
                                    ? 'جميع حقوق الملكية الفكرية للموقع وتصميمه محفوظة لـ Global Pulse Media. المقالات الإخبارية تعود ملكيتها لمصادرها الأصلية.'
                                    : 'All intellectual property rights for the website and its design are reserved to Global Pulse Media. News articles belong to their original sources.'}
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Terms;
