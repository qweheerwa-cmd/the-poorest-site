import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import { Plus, Trash2, TrendingDown, Utensils, Dices } from "lucide-react";

export default function Tools() {
  const [activeTab, setActiveTab] = useState<"expense" | "random">("expense");
  const [expenses, setExpenses] = useState([
    { id: 1, category: "食物", amount: 15, description: "早餐", date: "2026-06-23" },
    { id: 2, category: "交通", amount: 5, description: "公交", date: "2026-06-23" },
    { id: 3, category: "娱乐", amount: 10, description: "电影票", date: "2026-06-22" },
  ]);

  const [newExpense, setNewExpense] = useState({
    category: "食物",
    amount: "",
    description: "",
  });

  const [randomResult, setRandomResult] = useState<string | null>(null);

  const foodOptions = [
    "白米饭 + 榨菜",
    "煮面条 + 鸡蛋",
    "馄饨汤",
    "清汤面",
    "番茄鸡蛋面",
    "青菜豆腐汤",
    "馒头 + 咸菜",
    "玉米粥",
    "红豆粥",
    "绿豆粥",
    "馄饨汤 + 馒头",
    "番茄鸡蛋面 + 青菜",
  ];

  const handleAddExpense = () => {
    if (!newExpense.amount || !newExpense.description) return;

    const expense = {
      id: Math.max(...expenses.map((e) => e.id), 0) + 1,
      category: newExpense.category,
      amount: parseFloat(newExpense.amount),
      description: newExpense.description,
      date: new Date().toISOString().split("T")[0],
    };

    setExpenses([expense, ...expenses]);
    setNewExpense({ category: "食物", amount: "", description: "" });
  };

  const handleDeleteExpense = (id: number) => {
    setExpenses(expenses.filter((e) => e.id !== id));
  };

  const handleRandomDecide = () => {
    const randomIndex = Math.floor(Math.random() * foodOptions.length);
    setRandomResult(foodOptions[randomIndex]);
  };

  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
  const categories = Array.from(new Set(expenses.map((e) => e.category)));

  return (
    <div className="min-h-screen bg-background">
      {/* 导航栏 */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/">
            <div className="flex items-center space-x-2 cursor-pointer">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">¥</span>
              </div>
              <span className="text-xl font-bold text-primary">全网最穷站</span>
            </div>
          </Link>
          <nav className="flex items-center space-x-4">
            <Link href="/community">
              <Button variant="ghost" className="text-foreground hover:text-primary">
                社区
              </Button>
            </Link>

          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-primary mb-2">工具箱</h1>
        <p className="text-muted-foreground mb-8">为穷人量身定制的实用工具</p>



        {/* 标签页 */}
        <div className="flex gap-4 mb-8 border-b border-border">
          <button
            onClick={() => setActiveTab("expense")}
            className={`px-4 py-3 font-semibold transition-colors ${
              activeTab === "expense"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <TrendingDown className="w-5 h-5 inline mr-2" />
            记账本
          </button>
          <button
            onClick={() => setActiveTab("random")}
            className={`px-4 py-3 font-semibold transition-colors ${
              activeTab === "random"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Dices className="w-5 h-5 inline mr-2" />
            今天吃什么
          </button>
        </div>

        {/* 记账本标签页 */}
        {activeTab === "expense" && (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* 左侧：添加开销表单 */}
            <div className="lg:col-span-1">
              <Card className="p-6 border-border sticky top-24">
                <h2 className="text-xl font-bold text-foreground mb-4">记录开销</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      分类
                    </label>
                    <select
                      value={newExpense.category}
                      onChange={(e) =>
                        setNewExpense({ ...newExpense, category: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground"
                    >
                      <option>食物</option>
                      <option>交通</option>
                      <option>娱乐</option>
                      <option>生活</option>
                      <option>医疗</option>
                      <option>其他</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      金额 (元)
                    </label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={newExpense.amount}
                      onChange={(e) =>
                        setNewExpense({ ...newExpense, amount: e.target.value })
                      }
                      className="bg-background border-border"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      描述
                    </label>
                    <Input
                      placeholder="例如：早餐"
                      value={newExpense.description}
                      onChange={(e) =>
                        setNewExpense({ ...newExpense, description: e.target.value })
                      }
                      className="bg-background border-border"
                    />
                  </div>

                  <Button
                    onClick={handleAddExpense}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    添加
                  </Button>
                </div>

                {/* 统计信息 */}
                <div className="mt-8 pt-8 border-t border-border space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">今日总支出</p>
                    <p className="text-3xl font-bold text-primary">¥{totalExpense.toFixed(2)}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">分类统计</p>
                    <div className="space-y-2">
                      {categories.map((cat) => {
                        const catTotal = expenses
                          .filter((e) => e.category === cat)
                          .reduce((sum, e) => sum + e.amount, 0);
                        return (
                          <div key={cat} className="flex justify-between text-sm">
                            <span className="text-foreground">{cat}</span>
                            <span className="text-primary font-semibold">
                              ¥{catTotal.toFixed(2)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* 右侧：开销列表 */}
            <div className="lg:col-span-2">
              <h2 className="text-xl font-bold text-foreground mb-4">开销记录</h2>

              {expenses.length > 0 ? (
                <div className="space-y-3">
                  {expenses.map((expense) => (
                    <Card key={expense.id} className="p-4 border-border flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="px-2 py-1 bg-primary/20 text-primary text-xs font-semibold rounded">
                            {expense.category}
                          </span>
                          <h4 className="font-semibold text-foreground">{expense.description}</h4>
                        </div>
                        <p className="text-sm text-muted-foreground">{expense.date}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-2xl font-bold text-primary">¥{expense.amount.toFixed(2)}</span>
                        <button
                          onClick={() => handleDeleteExpense(expense.id)}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="p-12 text-center border-border">
                  <p className="text-muted-foreground">还没有记录任何开销</p>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* 今天吃什么标签页 */}
        {activeTab === "random" && (
          <div className="max-w-2xl mx-auto">
            <Card className="p-12 text-center border-border">
              <Utensils className="w-16 h-16 text-primary mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-foreground mb-4">今天吃什么？</h2>
              <p className="text-muted-foreground mb-8">
                不知道吃什么？让我们帮你决定！这个工具会随机推荐一个穷人友好的食物方案。
              </p>

              {randomResult && (
                <div className="mb-8 p-8 bg-primary/10 border-2 border-primary rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">今天推荐：</p>
                  <p className="text-4xl font-bold text-primary">{randomResult}</p>
                </div>
              )}

              <Button
                onClick={handleRandomDecide}
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg"
              >
                <Dices className="w-5 h-5 mr-2" />
                随机决定
              </Button>

              {/* 推荐列表 */}
              <div className="mt-12 text-left">
                <h3 className="text-xl font-bold text-foreground mb-4">推荐菜单</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {foodOptions.map((food, index) => (
                    <Card key={index} className="p-3 border-border">
                      <p className="text-foreground">{food}</p>
                    </Card>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        )}


      </div>
    </div>
  );
}
