import { getToken } from '/@/utils/auth';
import { defHttp } from '/@/utils/http/axios';

export interface Report {
  id: string;
  code: string;
  name: string;
  // 封面地址
  thumb: string | null;
}

export interface ColumnItem {
  id: string;

  paramName: string;
  paramTxt: string;
  paramValue: string;
}

export interface Show<T = any> {
  id: string;
  code: string;
  name: string;
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
  const target = (res[0] as any[])[0];
  const cols = target.children;
  return cols as Col[];
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
  mode: number;
  dictList: DictList[];
};

export interface DictList {
  value: string;
  text: string;
  title: string;
}

/**
 * 根据报表id获取表格数据
 * @param reportId 报表 ID
 * @returns 表格数据
 */
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

const selects = {
  businessid: {
    name: '业务类型',
    path: 'getDmBusinessType',
  },

  custypeid: {
    name: '客户类型',
    path: null,
    options: [
      {
        status: 1,
        code: '0',
        id: '0',
        name: 'Individual',
      },
      {
        status: 1,
        code: '1',
        id: '1',
        name: 'Group',
      },
    ] as SelectOption[],
  },
  cuslevelid: {
    name: '客户级别',
    path: 'getDictData?dictTypeId=1204',
  },
  operareaid: {
    name: '运营区域',
    path: 'getDmSaleArea',
  },
  rateclassid: {
    name: '账目类型',
    path: 'getDmRateclassType',
  },
  operwayid: {
    name: '运营方式',
    path: null,
    options: [
      {
        status: 1,
        code: '1',
        id: '1',
        name: 'Prepaid',
      },
      {
        status: 1,
        code: '2',
        id: '2',
        name: 'Postpaid',
      },
    ] as SelectOption[],
  },
  subtypeid: {
    name: '用户类型',
    path: 'getDictData?dictTypeId=1300',
  },
  societytypeid: {
    name: '社会类别',
    path: 'getDictData?dictTypeId=1202',
  },
  salechannelid: {
    name: '营销渠道',
    path: 'getDmSaleChannel',
  },
  a: {
    name: '资源类型',
    path: 'getDmResourceType',
  },
  productchildtypeid: {
    name: '产品类型',
    path: null,
    options: [
      {
        status: 1,
        code: '1',
        id: '1',
        name: 'physical',
      },
      {
        status: 1,
        code: '2',
        id: '2',
        name: 'service',
      },
    ] as SelectOption[],
  },
  paymethodid: {
    name: '付款方式',
    path: 'getDmPaymentMethod',
  },
  tradetypeid: {
    name: '操作类型',
    path: null,
    options: [
      {
        status: 1,
        code: '0',
        id: '0',
        name: '付费',
      },
      {
        status: 1,
        code: '1',
        id: '1',
        name: '收费',
      },
    ] as SelectOption[],
  },
} as const;

export type S = keyof typeof selects;
export const selectKeys = Object.keys(selects) as S[];
export type SelectOption = {
  id: string;
  name: string;
  code: string;
  status: 0 | 1;
};
/**
 * 根据属性名获取下拉选项
 * @param key 属性名
 * @returns  下拉选项
 */
export function getSelectByKey(key: S) {
  const taget = selects[key];

  if (taget.path === null) {
    return Promise.resolve({
      list: taget.options,
      name: taget.name,
      key,
    });
  }
  const token = getToken();
  return defHttp
    .get<SelectOption[]>({
      url: `/dm/api/${taget.path}`,
      params: {
        token,
      },
    })
    .then((res) => {
      return {
        list: res,
        name: taget.name,
        key,
      };
    });
}
