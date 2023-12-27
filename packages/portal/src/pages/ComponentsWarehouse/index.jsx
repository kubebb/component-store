// 注意: 出码引擎注入的临时变量默认都以 "__$$" 开头，禁止在搭建的代码中直接访问。
// 例外：react 框架的导出名和各种组件名除外。
import React from 'react';

import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Input,
  Modal,
  Page,
  Pagination,
  Row,
  Select,
  Space,
  Status,
  Table,
  Tooltip,
  Typography,
} from '@tenx-ui/materials';

import {
  AntdIconExclamationCircleOutlined,
  AntdIconPlusOutlined,
  AntdIconReloadOutlined,
} from '@tenx-ui/icon-materials';

import { getUnifiedHistory } from '@tenx-ui/utils/es/UnifiedLink/index.prod';
import { matchPath, useLocation } from '@umijs/max';
import qs from 'query-string';
import { DataProvider } from 'shared-components';

import utils, { RefsManager } from '../../utils/__utils';

import * as __$$i18n from '../../i18n';

import __$$constants from '../../__constants';

import './index.css';

class ComponentsWarehouse$$Page extends React.Component {
  get location() {
    return this.props.self?.location;
  }
  get match() {
    return this.props.self?.match;
  }
  get history() {
    return this.props.self?.history;
  }
  get appHelper() {
    return this.props.self?.appHelper;
  }

  _context = this;

  get constants() {
    return __$$constants || {};
  }

  constructor(props, context) {
    super(props);

    this.utils = utils;

    this._refsManager = new RefsManager();

    __$$i18n._inject2(this);

    this.state = {
      cluster: undefined,
      clusterLoading: true,
      clusters: undefined,
      current: 1,
      deleteLoading: false,
      filters: undefined,
      isOpenModal: false,
      modalType: 'delete',
      pagination: undefined,
      record: {},
      searchKey: 'name',
      searchValue: undefined,
      size: 10,
      sorter: undefined,
    };
  }

  $ = refName => {
    return this._refsManager.get(refName);
  };

  $$ = refName => {
    return this._refsManager.getAll(refName);
  };

  closeModal() {
    this.setState({
      isOpenModal: false,
    });
  }

  async confirmDeleteModal(e, payload) {
    this.setState({
      deleteLoading: true,
    });
    try {
      await this.utils.bff.removeRepository({
        name: this.state.record?.name,
        cluster: this.state.cluster,
      });
      this.closeModal();
      this.utils.notification.success({
        message: this.i18n('i18n-7jw61pr8'),
      });
      setTimeout(() => {
        this.props.useGetRepositories.mutate();
        this.setState({
          deleteLoading: false,
        });
      }, 200);
    } catch (error) {
      this.setState({
        deleteLoading: false,
      });
      this.utils.notification.warnings({
        message: this.i18n('i18n-6ov650p4'),
        errors: error?.response?.errors,
      });
    }
  }

  getCluster() {
    return this.state.cluster;
  }

  handleClusterChange(v) {
    this.setState(
      {
        cluster: v,
      },
      this.handleQueryChange
    );
  }

  handlePaginationChange(c, s) {
    this.setState(
      {
        size: s,
        current: c,
      },
      this.handleQueryChange
    );
  }

  handleQueryChange() {
    const { repositoryType, status } = this.state.filters || {};
    const params = {
      page: this.state?.current || 1,
      pageSize: this.state?.pageSize || 10,
      name: this.state?.searchValue,
      cluster: this.getCluster(),
    };
    if (this.state.sorter?.order) {
      params.sortField = this.state.sorter?.field;
      params.sortDirection = this.state.sorter?.order;
    }
    if (repositoryType?.length > 0) {
      params.repositoryTypes = repositoryType;
    }
    if (status?.length > 0) {
      params.statuses = status;
    } else {
      params.statuses = undefined;
    }
    this.utils?.changeLocationQuery(this, 'useGetRepositories', params);
    // this.props.useGetRepositories?.fetch && this.props.useGetRepositories?.fetch({
    //   "page": this.state?.current || 1,
    //   "pageSize": this.state?.pageSize || 10,
    //   "name": this.state?.searchValue,
    // })
  }

  handleRefresh(event) {
    this.props.useGetRepositories?.mutate();
  }

  handleSearch(v) {
    this.setState(
      {
        current: 1,
      },
      this.handleQueryChange
    );
  }

  handleSearchValueChange(e) {
    this.setState({
      searchValue: e.target.value,
      // current: 1,
    });
  }

  handleTableChange(pagination, filters, sorter, extra) {
    this.setState(
      {
        pagination,
        filters,
        sorter,
      },
      this.handleQueryChange
    );
  }

  async loadClusters() {
    const res =
      await this.props.appHelper?.utils?.bffSdk?.getCurrentUserClustersForIsDeployedResource({
        group: 'core.kubebb.k8s.com.cn',
        version: 'v1alpha1',
        plural: 'repositories',
      });
    const clusters = res?.userCurrent?.clusters
      ?.filter(item => item.isDeployedResource === true)
      ?.map(item => ({
        value: item.name,
        label: item.fullName,
      }));
    this.setState(
      {
        clusters,
        cluster: clusters?.[0]?.value,
        clusterLoading: false,
      },
      this.handleQueryChange
    );
  }

  openDeleteModal(e, { record }) {
    this.setState({
      isOpenModal: true,
      modalType: 'delete',
      record,
    });
  }

  paginationShowTotal(total, range) {
    return `${this.i18n('i18n-wajqflwo')} ${total} ${this.i18n('i18n-7vre8aeh')}`;
  }

  componentDidMount() {
    this.loadClusters();
  }

  render() {
    const __$$context = this._context || this;
    const { state } = __$$context;
    return (
      <Page>
        <Row __component_name="Row" wrap={true}>
          <Col __component_name="Col" span={24}>
            <Row __component_name="Row" justify="space-between" wrap={false}>
              <Col __component_name="Col" style={{ alignItems: 'center', display: 'flex' }}>
                <Typography.Title
                  __component_name="Typography.Title"
                  bold={true}
                  bordered={false}
                  ellipsis={true}
                  level={1}
                >
                  {this.i18n('i18n-s7vniwvk') /* 组件仓库管理 */}
                </Typography.Title>
              </Col>
              <Col __component_name="Col">
                <Select
                  __component_name="Select"
                  _sdkSwrGetFunc={{}}
                  allowClear={false}
                  disabled={false}
                  onChange={function () {
                    return this.handleClusterChange.apply(
                      this,
                      Array.prototype.slice.call(arguments).concat([])
                    );
                  }.bind(this)}
                  options={__$$eval(() => this.state.clusters || [])}
                  placeholder={this.i18n('i18n-iaqzm5yl') /* 请选择集群 */}
                  showSearch={true}
                  style={{ width: 200 }}
                  value={__$$eval(() => this.getCluster())}
                />
              </Col>
            </Row>
          </Col>
          <Col __component_name="Col" span={24}>
            <Card
              __component_name="Card"
              actions={[]}
              bordered={false}
              hoverable={false}
              loading={false}
              ref={this._refsManager.linkRef('card-bf69e441')}
              size="default"
              style={{ paddingBottom: '16px', paddingTop: '4px' }}
              type="inner"
            >
              <Row __component_name="Row" gutter={[0, 0]} wrap={true}>
                <Col __component_name="Col" span={24}>
                  <Row __component_name="Row" justify="space-between" wrap={false}>
                    <Col __component_name="Col">
                      <Space align="center" direction="horizontal" size={12}>
                        <Button
                          __component_name="Button"
                          block={false}
                          danger={false}
                          disabled={false}
                          ghost={false}
                          href={__$$eval(
                            () => `/components/warehouse/create?cluster=${this.state.cluster}`
                          )}
                          icon={<AntdIconPlusOutlined __component_name="AntdIconPlusOutlined" />}
                          shape="default"
                          target="_self"
                          type="primary"
                        >
                          {this.i18n('i18n-1po87kgw') /* 组件仓库 */}
                        </Button>
                        <Button
                          __component_name="Button"
                          block={false}
                          danger={false}
                          disabled={false}
                          ghost={false}
                          icon={
                            <AntdIconReloadOutlined __component_name="AntdIconReloadOutlined" />
                          }
                          onClick={function () {
                            return this.handleRefresh.apply(
                              this,
                              Array.prototype.slice.call(arguments).concat([])
                            );
                          }.bind(this)}
                          shape="default"
                        >
                          {this.i18n('i18n-pzwgpt2r') /* 刷新 */}
                        </Button>
                        <Input.Search
                          __component_name="Input.Search"
                          onChange={function () {
                            return this.handleSearchValueChange.apply(
                              this,
                              Array.prototype.slice.call(arguments).concat([])
                            );
                          }.bind(this)}
                          onSearch={function () {
                            return this.handleSearch.apply(
                              this,
                              Array.prototype.slice.call(arguments).concat([])
                            );
                          }.bind(this)}
                          placeholder={this.i18n('i18n-q3xp5myo') /* 请输入仓库名称搜索 */}
                          style={{ width: '240px' }}
                        />
                      </Space>
                    </Col>
                    <Col __component_name="Col">
                      <Space align="center" direction="horizontal">
                        <Pagination
                          __component_name="Pagination"
                          current={__$$eval(() => this.state && this.state.current)}
                          onChange={function () {
                            return this.handlePaginationChange.apply(
                              this,
                              Array.prototype.slice.call(arguments).concat([])
                            );
                          }.bind(this)}
                          onShowSizeChange={function () {
                            return this.handlePaginationChange.apply(
                              this,
                              Array.prototype.slice.call(arguments).concat([])
                            );
                          }.bind(this)}
                          pageSize={__$$eval(() => this.state?.size)}
                          showTotal={function () {
                            return this.paginationShowTotal.apply(
                              this,
                              Array.prototype.slice.call(arguments).concat([])
                            );
                          }.bind(this)}
                          simple={true}
                          total={__$$eval(
                            () => this.props.useGetRepositories?.data?.repositories?.totalCount || 0
                          )}
                        />
                      </Space>
                    </Col>
                  </Row>
                </Col>
                <Col __component_name="Col" span={24}>
                  <Table
                    __component_name="Table"
                    columns={[
                      {
                        dataIndex: 'name',
                        ellipsis: { showTitle: true },
                        key: 'name',
                        title: this.i18n('i18n-v6908o0r') /* 组件仓库名称 */,
                      },
                      {
                        dataIndex: 'url',
                        render: (text, record, index) =>
                          (__$$context => (
                            <Typography.Paragraph
                              code={false}
                              copyable={false}
                              delete={false}
                              disabled={false}
                              editable={false}
                              ellipsis={{
                                rows: 2,
                                tooltip: {
                                  _unsafe_MixedSetter_title_select: 'VariableSetter',
                                  title: __$$eval(() => record?.url),
                                },
                              }}
                              mark={false}
                              strong={false}
                              style={{ fontSize: '' }}
                              underline={false}
                            >
                              {__$$eval(() => record?.url)}
                            </Typography.Paragraph>
                          ))(__$$createChildContext(__$$context, { text, record, index })),
                        title: this.i18n('i18n-iqh7qzhi') /* URL */,
                      },
                      {
                        dataIndex: 'status',
                        filters: __$$eval(() => this.utils.getComponentWarehouseStatus(this)),
                        key: 'status',
                        render: (text, record, index) =>
                          (__$$context => (
                            <Space
                              __component_name="Space"
                              align="center"
                              direction="horizontal"
                              size="small"
                            >
                              <Status
                                __component_name="Status"
                                id={__$$eval(() => record?.status)}
                                types={__$$eval(() =>
                                  __$$context.utils.getComponentWarehouseStatus(__$$context, true)
                                )}
                              />
                              <Tooltip
                                __component_name="Tooltip"
                                title={__$$eval(() => record?.reason || '-')}
                              >
                                <Container
                                  __component_name="Container"
                                  color="colorTextDescription"
                                >
                                  {!!__$$eval(() => record?.status?.includes('failed')) && (
                                    <AntdIconExclamationCircleOutlined
                                      __component_name="AntdIconExclamationCircleOutlined"
                                      style={{ color: '' }}
                                    />
                                  )}
                                </Container>
                              </Tooltip>
                            </Space>
                          ))(__$$createChildContext(__$$context, { text, record, index })),
                        title: this.i18n('i18n-o48ciymn') /* 当前状态 */,
                      },
                      {
                        dataIndex: 'lastSuccessfulTime',
                        key: 'lastSuccessfulTime',
                        render: (text, record, index) =>
                          (__$$context => (
                            <Typography.Time
                              __component_name="Typography.Time"
                              format=""
                              relativeTime={false}
                              time={__$$eval(() => record?.lastSuccessfulTime)}
                            />
                          ))(__$$createChildContext(__$$context, { text, record, index })),
                        sorter: true,
                        title: this.i18n('i18n-d9x7wf7j') /* 最新同步时间 */,
                      },
                      {
                        dataIndex: 'creationTimestamp',
                        key: 'creationTimestamp',
                        render: (text, record, index) =>
                          (__$$context => (
                            <Typography.Time
                              __component_name="Typography.Time"
                              format=""
                              relativeTime={false}
                              time={__$$eval(() => record?.creationTimestamp)}
                            />
                          ))(__$$createChildContext(__$$context, { text, record, index })),
                        sorter: true,
                        title: this.i18n('i18n-gjr2ewmb') /* 创建时间 */,
                      },
                      {
                        dataIndex: 'op',
                        render: (text, record, index) =>
                          (__$$context => (
                            <Space align="center" direction="horizontal" size={12}>
                              <Button
                                __component_name="Button"
                                block={false}
                                danger={false}
                                disabled={false}
                                ghost={false}
                                href={__$$eval(
                                  () =>
                                    `/components/warehouse/${record?.name}?cluster=${__$$context.state.cluster}`
                                )}
                                shape="default"
                              >
                                {this.i18n('i18n-u4ajovin') /* 编辑 */}
                              </Button>
                              <Button
                                __component_name="Button"
                                block={false}
                                danger={false}
                                disabled={false}
                                ghost={false}
                                onClick={function () {
                                  return this.openDeleteModal.apply(
                                    this,
                                    Array.prototype.slice.call(arguments).concat([
                                      {
                                        record: record,
                                      },
                                    ])
                                  );
                                }.bind(__$$context)}
                                shape="default"
                              >
                                {this.i18n('i18n-lc4oie5j') /* 删除 */}
                              </Button>
                            </Space>
                          ))(__$$createChildContext(__$$context, { text, record, index })),
                        title: this.i18n('i18n-ioy0ge9h') /* 操作 */,
                      },
                    ]}
                    dataSource={__$$eval(
                      () => this.props.useGetRepositories?.data?.repositories?.nodes || []
                    )}
                    loading={__$$eval(
                      () =>
                        this.props.useGetRepositories?.isLoading ||
                        this.props?.useGetRepositories?.loading ||
                        this.state.clusterLoading ||
                        false
                    )}
                    onChange={function () {
                      return this.handleTableChange.apply(
                        this,
                        Array.prototype.slice.call(arguments).concat([])
                      );
                    }.bind(this)}
                    pagination={false}
                    ref={this._refsManager.linkRef('table-ba33c713')}
                    rowKey="id"
                    scroll={{ scrollToFirstRowOnChange: true }}
                    showHeader={true}
                    size="middle"
                    style={{ marginTop: '4px' }}
                  />
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
        <Modal
          __component_name="Modal"
          centered={false}
          confirmLoading={__$$eval(() => this.state.deleteLoading)}
          destroyOnClose={true}
          forceRender={false}
          keyboard={true}
          mask={true}
          maskClosable={false}
          onCancel={function () {
            return this.closeModal.apply(this, Array.prototype.slice.call(arguments).concat([]));
          }.bind(this)}
          onOk={function () {
            return this.confirmDeleteModal.apply(
              this,
              Array.prototype.slice.call(arguments).concat([])
            );
          }.bind(this)}
          open={__$$eval(() => this.state.isOpenModal && this.state.modalType === 'delete')}
          title={this.i18n('i18n-enfsxrze') /* 删除组件仓库 */}
        >
          <Alert
            __component_name="Alert"
            message={[
              <Typography.Text
                __component_name="Typography.Text"
                disabled={false}
                ellipsis={true}
                strong={false}
                style={{ fontSize: '' }}
                key="node_oclkj671un15"
              >
                {this.i18n('i18n-lc4oie5j') /* 删除 */}
              </Typography.Text>,
              <Typography.Text
                __component_name="Typography.Text"
                disabled={false}
                ellipsis={{
                  rows: 1,
                  tooltip: {
                    _unsafe_MixedSetter_title_select: 'VariableSetter',
                    title: __$$eval(() => this.state.record?.name || '-'),
                  },
                }}
                strong={true}
                style={{ fontSize: '', maxWidth: '180px', paddingLeft: '4px', paddingRight: '4px' }}
                key="node_oclkj671un16"
              >
                {__$$eval(() => this.state.record?.name || '-')}
              </Typography.Text>,
              <Typography.Text
                __component_name="Typography.Text"
                disabled={false}
                ellipsis={false}
                strong={false}
                style={{ fontSize: '' }}
                key="node_oclkj671un17"
              >
                {this.i18n('i18n-1y52u16q') /* 组件仓库，其下组件将同步删除，请确认！ */}
              </Typography.Text>,
            ]}
            showIcon={true}
            style={{}}
            type="info"
          />
        </Modal>
      </Page>
    );
  }
}

const PageWrapper = (props = {}) => {
  const location = useLocation();
  const history = getUnifiedHistory();
  const match = matchPath({ path: '/components/warehouse' }, location.pathname);
  history.match = match;
  history.query = qs.parse(location.search);
  const appHelper = {
    utils,
    constants: __$$constants,
    location,
    match,
    history,
  };
  const self = {
    appHelper,
    ...appHelper,
  };
  return (
    <DataProvider
      self={self}
      sdkInitFunc={{
        enabled: undefined,
        params: undefined,
      }}
      sdkSwrFuncs={[
        {
          func: 'useGetRepositories',
          params: function applyThis() {
            return {
              cluster: this.getCluster && this.getCluster(),
            };
          }.apply(self),
          enableLocationSearch: function applyThis() {
            return true;
          }.apply(self),
        },
      ]}
      render={dataProps => (
        <ComponentsWarehouse$$Page {...props} {...dataProps} self={self} appHelper={appHelper} />
      )}
    />
  );
};
export default PageWrapper;

function __$$eval(expr) {
  try {
    return expr();
  } catch (error) {}
}

function __$$evalArray(expr) {
  const res = __$$eval(expr);
  return Array.isArray(res) ? res : [];
}

function __$$createChildContext(oldContext, ext) {
  const childContext = {
    ...oldContext,
    ...ext,
    // 重写 state getter，保证 state 的指向不变，这样才能从 context 中拿到最新的 state
    get state() {
      return oldContext.state;
    },
    // 重写 props getter，保证 props 的指向不变，这样才能从 context 中拿到最新的 props
    get props() {
      return oldContext.props;
    },
  };
  childContext.__proto__ = oldContext;
  return childContext;
}
