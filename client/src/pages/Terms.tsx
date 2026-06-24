import { useState } from "react";

export default function Terms() {
  const [activeTab, setActiveTab] = useState<"terms" | "privacy">("terms");

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-primary mb-8">法律条款</h1>
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab("terms")}
            className={`px-6 py-2 rounded ${activeTab === "terms" ? "bg-primary text-black" : "bg-gray-800 text-white"}`}
          >用户协议</button>
          <button
            onClick={() => setActiveTab("privacy")}
            className={`px-6 py-2 rounded ${activeTab === "privacy" ? "bg-primary text-black" : "bg-gray-800 text-white"}`}
          >隐私政策</button>
        </div>
        <div className="bg-gray-900 p-8 rounded-lg">
          {activeTab === "terms" ? <TermsContent /> : <PrivacyContent />}
        </div>
      </div>
    </div>
  );
}

function TermsContent() {
  return (
    <div className="prose prose-invert max-w-none">
      <h2 className="text-2xl font-bold mb-6">全网最穷站 用户协议</h2>
      <h3 className="text-xl font-semibold mt-6 mb-3">1. 总则</h3>
      <p className="text-gray-300 leading-relaxed">本网站（以下简称"本站"）是一个为寻找同类、分享经历而建立的社区平台。本站的核心价值观是"穷并快乐着"，我们欢迎所有真诚的用户。</p>
      <h3 className="text-xl font-semibold mt-6 mb-3">2. 用户行为规范</h3>
      <p className="text-gray-300 leading-relaxed">用户在使用本站服务时，应当遵守法律法规，不得发布以下内容：</p>
      <ul className="list-disc pl-6 text-gray-300 space-y-2 mt-2">
        <li>违反中华人民共和国法律法规的内容</li>
        <li>色情、赌博、暴力等违法信息</li>
        <li>虚假信息或诈骗内容</li>
        <li>侵犯他人合法权益的信息</li>
        <li>垃圾广告或恶意营销内容</li>
      </ul>
      <h3 className="text-xl font-semibold mt-6 mb-3">3. 账号管理</h3>
      <p className="text-gray-300 leading-relaxed">用户注册的账号仅限本人使用，不得转让或出借。用户应对账号下的所有行为负责。</p>
      <h3 className="text-xl font-semibold mt-6 mb-3">4. 免责声明</h3>
      <p className="text-gray-300 leading-relaxed">本站内容由用户生成，不代表本站立场。用户自行承担发布内容的法律责任。本站有权删除违规内容或封禁违反协议的账号。</p>
    </div>
  );
}

function PrivacyContent() {
  return (
    <div className="prose prose-invert max-w-none">
      <h2 className="text-2xl font-bold mb-6">全网最穷站 隐私政策</h2>
      <h3 className="text-xl font-semibold mt-6 mb-3">1. 信息收集</h3>
      <p className="text-gray-300 leading-relaxed">本站仅收集用户主动提供的信息，包括：</p>
      <ul className="list-disc pl-6 text-gray-300 space-y-2 mt-2">
        <li>注册时提供的用户名和邮箱</li>
        <li>用户发布的帖子和评论内容</li>
        <li>浏览器自动提供的技术信息（IP地址、浏览器类型等）</li>
      </ul>
      <h3 className="text-xl font-semibold mt-6 mb-3">2. 信息使用</h3>
      <p className="text-gray-300 leading-relaxed">收集的信息仅用于：提供和改善本站服务、用户身份验证、内容展示和社区管理。</p>
      <h3 className="text-xl font-semibold mt-6 mb-3">3. 信息安全</h3>
      <p className="text-gray-300 leading-relaxed">本站采取合理的安全措施保护用户信息，但不对第三方攻击导致的信息泄露承担责任。</p>
      <h3 className="text-xl font-semibold mt-6 mb-3">4. 联系我们</h3>
      <p className="text-gray-300 leading-relaxed">如有隐私相关疑问，请发送邮件至 313575218@qq.com</p>
    </div>
  );
}
