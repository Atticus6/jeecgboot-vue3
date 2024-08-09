export const getLastMonth = () => {
  // 获取当前日期
  const currentDate = new Date();
  // 计算上个月的年月
  let lastMonthYear = currentDate.getFullYear();
  let lastMonthMonth = currentDate.getMonth();
  // 如果上个月是 1 月,则年月应该是上一年的 12 月
  if (lastMonthMonth === 0) {
    lastMonthYear--;
    lastMonthMonth = 11;
  } else {
    lastMonthMonth--;
  }
  // 输出结果
  return `${lastMonthYear}-${String(lastMonthMonth + 1).padStart(2, '0')}`;
};

export const getThisMonth = () => {
  // 获取当前日期
  const currentDate = new Date();

  // 计算上个月的年月
  const y = currentDate.getFullYear();
  const m = currentDate.getMonth();

  // 输出结果
  return `${y}-${String(m + 1).padStart(2, '0')}`;
};

export const getYesterday = () => {
  // 获取当前日期
  const currentDate = new Date();

  // 获取前一天的日期
  const previousDate = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);

  // 格式化日期为 YYYY-MM-DD 格式
  const formattedPreviousDate = previousDate.toISOString().slice(0, 10);

  // // 输出前一天的日期，例如: "2024-08-07"
  return formattedPreviousDate;
};

export const getToday = () => {
  // 获取当前日期
  const currentDate = new Date();

  // 格式化日期为 YYYY-MM-DD 格式
  const formattedPreviousDate = currentDate.toISOString().slice(0, 10);

  // // 输出前一天的日期，例如: "2024-08-07"
  return formattedPreviousDate;
};
