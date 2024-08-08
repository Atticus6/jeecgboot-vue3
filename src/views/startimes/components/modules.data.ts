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
    path: 'querySaleAreaByOperator',
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
        name: '缴费',
      },
      {
        status: 1,
        code: '1',
        id: '1',
        name: '退费',
      },
    ] as SelectOption[],
  },
  operitemid: {
    name: '营业项目',
    path: 'getDmAction',
  },
  acceptsheetstatusid: {
    name: '受理单状态',
    path: null,
    options: [
      {
        status: 1,
        code: '0',
        id: '0',
        name: '未完工',
      },
      {
        status: 1,
        code: '1',
        id: '1',
        name: '已完工',
      },
      {
        status: 1,
        code: '2',
        id: '2',
        name: '已退单',
      },
    ] as SelectOption[],
  },
  operitemtypeid: {
    name: '营业项目类型',
    path: 'getDmActionType',
  },
  stocknamestr: {
    name: '仓库名称',
    path: 'getDmStock',
  },
  stockstatusid: {
    name: '库存状态',
    path: null,
    options: [
      {
        status: 1,
        code: '1',
        id: '1',
        name: '在库',
      },
      {
        status: 1,
        code: '2',
        id: '2',
        name: '不在库',
      },
    ] as SelectOption[],
  },
  phyresourcestatusid: {
    name: '资源状态',
    path: null,
    options: [
      {
        status: 1,
        code: '1',
        id: '1',
        name: '可用',
      },
      {
        status: 1,
        code: '2',
        id: '2',
        name: '预占用',
      },
      {
        status: 1,
        code: '3',
        id: '3',
        name: '占用',
      },
      {
        status: 1,
        code: '4',
        id: '4',
        name: '维修',
      },
      {
        status: 1,
        code: '5',
        id: '5',
        name: '报废',
      },
      {
        status: 1,
        code: '6',
        id: '6',
        name: '退还供应商',
      },
      {
        status: 1,
        code: '7',
        id: '7',
        name: '未激活',
      },
    ] as SelectOption[],
  },
  resourcetypenamestr: {
    name: '资源目录名称',
    path: 'getDmResourceType',
  },
  customerstatusid: {
    name: '客户状态',
    path: null,
    options: [
      {
        status: 1,
        code: '0',
        id: '0',
        name: '潜在',
      },
      {
        status: 1,
        code: '1',
        id: '1',
        name: '现有',
      },
      {
        status: 1,
        code: '2',
        id: '2',
        name: '注销',
      },
    ] as SelectOption[],
  },
  thirdnamestr: {
    name: '供应商',
    path: 'getThird',
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

  return defHttp
    .get<SelectOption[]>({
      url: `/dm/api/${taget.path}`,
    })
    .then((res) => {
      return {
        list: res,
        name: taget.name,
        key,
      };
    });
}

type Address = {
  id: number;
  fullName: string;
  fullCode: string;
  addressLevel: {
    id: number;
    name: 'City' | 'Area' | 'Street';
    layer: number;
  };
  children: Address[] | null;
};

export function getValidAddresseTree() {
  return defHttp.get<Address>({
    url: '/dm/api/getValidAddresseTree',
  });
}
