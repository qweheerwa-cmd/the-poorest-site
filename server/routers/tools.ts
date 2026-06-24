import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { createExpense, getExpensesByUser } from "../db";

export const toolsRouter = router({
  // 创建支出记录
  createExpense: protectedProcedure
    .input(
      z.object({
        category: z.string().min(1).max(64),
        amount: z.string(), // 使用字符串来处理 decimal
        description: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const expense = await createExpense({
        userId: ctx.user.id,
        category: input.category,
        amount: input.amount as any,
        description: input.description,
      });
      return expense;
    }),

  // 获取用户的支出列表
  getUserExpenses: protectedProcedure
    .input(z.object({ limit: z.number().default(50) }))
    .query(async ({ input, ctx }) => {
      const expenses = await getExpensesByUser(ctx.user.id, input.limit);
      return expenses;
    }),

  // 计算今日总支出
  getTodayExpenses: protectedProcedure.query(async ({ ctx }) => {
    const expenses = await getExpensesByUser(ctx.user.id, 100);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayExpenses = expenses.filter((e: any) => {
      const expenseDate = new Date(e.date);
      expenseDate.setHours(0, 0, 0, 0);
      return expenseDate.getTime() === today.getTime();
    });

    return {
      expenses: todayExpenses,
      total: todayExpenses.reduce((sum: number, e: any) => sum + parseFloat(e.amount.toString()), 0),
    };
  }),

  // 获取分类统计
  getExpensesByCategory: protectedProcedure.query(async ({ ctx }) => {
    const expenses = await getExpensesByUser(ctx.user.id, 100);
    const categoryMap: Record<string, number> = {};

    expenses.forEach((e: any) => {
      const amount = parseFloat(e.amount.toString());
      categoryMap[e.category] = (categoryMap[e.category] || 0) + amount;
    });

    return Object.entries(categoryMap).map(([category, total]) => ({
      category,
      total,
    }));
  }),
});
