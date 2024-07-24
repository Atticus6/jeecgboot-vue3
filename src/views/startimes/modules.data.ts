import { getToken } from '/@/utils/auth';
import { defHttp } from '/@/utils/http/axios';

export type Pag<T = any> = {
  // 当前页数
  pageNo: number;
  // 每页多少条
  pageSize: number;
  //  总共多少条
  total: number;
  // 一共多少页
  pages: number;
  // 数据
  records: T[];
};

export interface Report {
  id: string;
  code: string;
  name: string;
  note: null;
  status: null;
  type: string;
  jsonStr: null;
  apiUrl: null;
  apiMethod: null;
  apiCode: null;
  // 封面地址
  thumb: string | null;
  template: number;
  createBy: null;
  createTime: null;
  updateBy: null;
  updateTime: null;
  dataList: null;
  dictInfo: null;
  delFlag: null;
  viewCount: null;
  cssStr: null;
  jsStr: null;
  pyStr: null;
  tenantId: null;
  isRefresh: null;
  shareViewUrl: null;
}

export interface ColumnItem {
  id: string;
  jimuReportHeadId: null;
  paramName: string;
  paramTxt: string;
  paramValue: string;
  orderNum: null;
  createBy: null;
  createTime: null;
  updateBy: null;
  updateTime: null;
  searchFlag: null;
  widgetType: null;
  searchMode: null;
  dictCode: null;
  searchFormat: null;
  extJson: null;
}

export interface Show<T = any> {
  id: string;
  code: string;
  name: string;
  note: null;
  status: null;
  type: string;
  jsonStr: string;
  apiUrl: null;
  apiMethod: null;
  apiCode: null;
  thumb: null;
  template: number;
  createBy: string;
  createTime: Date;
  updateBy: string;
  updateTime: Date;
  dataList: {
    numberFieldList: string[];
    expData: ExpData;
    replaceParams: ExpData;
    '&dbLink&': any[];
    utf8: {
      total: number;
      count: number;
      isPage: string;
      isList: string;
      dbType: string;
      list: T[];
      linkList: null;
    };
  };
  dictInfo: null;
  delFlag: number;
  viewCount: number;
  cssStr: null;
  jsStr: null;
  pyStr: null;
  tenantId: string;
  isRefresh: null;
  shareViewUrl: null;
}

export interface ExpData {}

export interface BasicColumn {
  title: string;
  dataIndex: string;
}

export const excludeIndex = ['pagehelper_row_id'];

/**
 * 根据 reportId获取信息
 */
export function show<T = any>(reportId: string, params: any) {
  const token = getToken();
  return defHttp.post<Show<T>>({
    url: '/jmreport/show',
    data: {
      id: reportId,
      params: JSON.stringify(params),
    },
    headers: {
      'X-Access-Token': token,
    },
  });
}

// export const getAllReport = () => {
//   const token = getToken();

//   return defHttp.get<Pag<Report>>({
//     url: '/jmreport/excelQuery',
//     params: {
//       token,
//     },
//   });
// };

// export function getDataByCode<T = any>(code: string) {
//   const token = getToken();

//   return defHttp.post<T[]>({
//     url: '/jmreport/qurestSql',
//     data: {
//       apiSelectId: code,
//       jmViewFirstLoad: '1',
//     },
//     params: {
//       token,
//     },
//   });
// }

export interface Col {
  expand: boolean;
  // 对象属性
  title: string;
  // 中文标题
  fieldText: string;
}
// 获取列名称
export async function getColumnsByReportId(reportId: string) {
  const res = await defHttp.get({
    url: `/jmreport/field/tree/${reportId}`,
  });
  const target = (res[0] as any[]).find((item) => item.code === 'utf8');
  const cols = target.children;
  return cols as Col[];
}

export enum InputMode {
  INPUT = 1,
  SELECT = 4,
}

export type InputItem = {
  title: string;
  name: string;
  dbCode: string;
  dbText: string;
  duplicate: null;
  type: string;
  realType: string;
  defaultValue: string;
  paramSearch: boolean;
  sort: number;
  format: null;
  dictCode: null;
  loadTree: null;
  loadTreeByValue: null;
} & (
  | {
      mode: InputMode.SELECT;
      dictList: DictList[];
    }
  | {
      mode: InputMode;
      dictList: null;
    }
);

export interface DictList {
  value: string;
  text: string;
  title: string;
}

// 获取表单列表
export function getFormItems(reportId: string) {
  const token = getToken();
  return defHttp.get<{
    rpName: string;
    list: InputItem[];
  }>({
    url: `/jmreport/getQueryInfo`,
    params: {
      reportId,
      param: '',
    },
    headers: {
      'X-Access-Token': token,
    },
  });
}
