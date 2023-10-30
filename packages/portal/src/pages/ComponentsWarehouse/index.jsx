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
      size: 10,
      record: {},
      sorter: undefined,
      cluster: undefined,
      current: 1,
      filters: undefined,
      clusters: undefined,
      modalType: 'delete',
      searchKey: 'name',
      pagination: undefined,
      isOpenModal: false,
      searchValue: undefined,
      deleteLoading: false,
      clusterLoading: true,
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

  getCluster() {
    return this.state.cluster;
  }

  handleSearch(v) {
    this.setState(
      {
        current: 1,
      },
      this.handleQueryChange
    );
  }

  async loadClusters() {
    const res = await this.props.appHelper?.utils?.bffSdk?.getClustersForIsDeployedResource({
      group: 'core.kubebb.k8s.com.cn',
      version: 'v1alpha1',
      plural: 'repositories',
    });
    const clusters = res?.clusters
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

  handleRefresh(event) {
    this.props.useGetRepositories?.mutate();
  }

  openDeleteModal(e, { record }) {
    this.setState({
      isOpenModal: true,
      modalType: 'delete',
      record,
    });
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

  handleClusterChange(v) {
    this.setState(
      {
        cluster: v,
      },
      this.handleQueryChange
    );
  }

  paginationShowTotal(total, range) {
    return `${this.i18n('i18n-wajqflwo')} ${total} ${this.i18n('i18n-7vre8aeh')}`;
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

  handleSearchValueChange(e) {
    this.setState({
      searchValue: e.target.value,
      // current: 1,
    });
  }

  componentDidMount() {
    this.loadClusters();
  }

  render() {
    const __$$context = this._context || this;
    const { state } = __$$context;
    return (
      <Page>
        <Row wrap={true} __component_name="Row">
          <Col span={24} __component_name="Col">
            <Row wrap={false} justify="space-between" __component_name="Row">
              <Col style={{ display: 'flex', alignItems: 'center' }} __component_name="Col">
                <Typography.Title
                  bold={true}
                  level={1}
                  bordered={false}
                  ellipsis={true}
                  __component_name="Typography.Title"
                >
                  {this.i18n('i18n-s7vniwvk') /* 组件仓库管理 */}
                </Typography.Title>
              </Col>
              <Col __component_name="Col">
                <Select
                  style={{ width: 200 }}
                  value={__$$eval(() => this.getCluster())}
                  options={__$$eval(() => this.state.clusters || [])}
                  disabled={false}
                  onChange={function () {
                    return this.handleClusterChange.apply(
                      this,
                      Array.prototype.slice.call(arguments).concat([])
                    );
                  }.bind(this)}
                  allowClear={false}
                  showSearch={true}
                  placeholder={this.i18n('i18n-iaqzm5yl') /* 请选择集群 */}
                  _sdkSwrGetFunc={{}}
                  __component_name="Select"
                />
              </Col>
            </Row>
          </Col>
          <Col span={24} __component_name="Col">
            <Card
              ref={this._refsManager.linkRef('card-bf69e441')}
              size="default"
              type="inner"
              style={{ paddingTop: '4px', paddingBottom: '16px' }}
              actions={[]}
              loading={false}
              bordered={false}
              hoverable={false}
              __component_name="Card"
            >
              <Row wrap={true} gutter={[0, 0]} __component_name="Row">
                <Col span={24} __component_name="Col">
                  <Row wrap={false} justify="space-between" __component_name="Row">
                    <Col __component_name="Col">
                      <Space size={12} align="center" direction="horizontal">
                        <Button
                          href={__$$eval(
                            () => `/components/warehouse/create?cluster=${this.state.cluster}`
                          )}
                          icon={<AntdIconPlusOutlined __component_name="AntdIconPlusOutlined" />}
                          type="primary"
                          block={false}
                          ghost={false}
                          shape="default"
                          danger={false}
                          target="_self"
                          disabled={false}
                          __component_name="Button"
                        >
                          {this.i18n('i18n-1po87kgw') /* 组件仓库 */}
                        </Button>
                        <Button
                          icon={
                            <AntdIconReloadOutlined __component_name="AntdIconReloadOutlined" />
                          }
                          block={false}
                          ghost={false}
                          shape="default"
                          danger={false}
                          onClick={function () {
                            return this.handleRefresh.apply(
                              this,
                              Array.prototype.slice.call(arguments).concat([])
                            );
                          }.bind(this)}
                          disabled={false}
                          __component_name="Button"
                        >
                          {this.i18n('i18n-pzwgpt2r') /* 刷新 */}
                        </Button>
                        <Input.Search
                          style={{ width: '240px' }}
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
                          __component_name="Input.Search"
                        />
                      </Space>
                    </Col>
                    <Col __component_name="Col">
                      <Space align="center" direction="horizontal">
                        <Pagination
                          total={__$$eval(
                            () => this.props.useGetRepositories?.data?.repositories?.totalCount || 0
                          )}
                          simple={true}
                          current={__$$eval(() => this.state && this.state.current)}
                          onChange={function () {
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
                          __component_name="Pagination"
                          onShowSizeChange={function () {
                            return this.handlePaginationChange.apply(
                              this,
                              Array.prototype.slice.call(arguments).concat([])
                            );
                          }.bind(this)}
                        />
                      </Space>
                    </Col>
                  </Row>
                </Col>
                <Col span={24} __component_name="Col">
                  <Table
                    ref={this._refsManager.linkRef('table-ba33c713')}
                    size="middle"
                    rowKey="id"
                    scroll={{ scrollToFirstRowOnChange: true }}
                    columns={[
                      {
                        key: 'name',
                        title: this.i18n('i18n-v6908o0r') /* 组件仓库名称 */,
                        ellipsis: { showTitle: true },
                        dataIndex: 'name',
                      },
                      {
                        title: this.i18n('i18n-iqh7qzhi') /* URL */,
                        render: (text, record, index) =>
                          (__$$context => (
                            <Typography.Paragraph
                              code={false}
                              mark={false}
                              style={{ fontSize: '' }}
                              delete={false}
                              strong={false}
                              copyable={false}
                              disabled={false}
                              editable={false}
                              ellipsis={{
                                rows: 2,
                                tooltip: {
                                  title: __$$eval(() => record?.url),
                                  _unsafe_MixedSetter_title_select: 'VariableSetter',
                                },
                              }}
                              underline={false}
                            >
                              {__$$eval(() => record?.url)}
                            </Typography.Paragraph>
                          ))(__$$createChildContext(__$$context, { text, record, index })),
                        dataIndex: 'url',
                      },
                      {
                        key: 'status',
                        title: this.i18n('i18n-o48ciymn') /* 当前状态 */,
                        render: (text, record, index) =>
                          (__$$context => (
                            <Space
                              size="small"
                              align="center"
                              direction="horizontal"
                              __component_name="Space"
                            >
                              <Status
                                id={__$$eval(() => record?.status)}
                                types={__$$eval(() =>
                                  __$$context.utils.getComponentWarehouseStatus(__$$context, true)
                                )}
                                __component_name="Status"
                              />
                              <Tooltip
                                title={__$$eval(() => record?.reason || '-')}
                                __component_name="Tooltip"
                              >
                                <Container
                                  color="colorTextDescription"
                                  __component_name="Container"
                                >
                                  {!!__$$eval(() => record?.status?.includes('failed')) && (
                                    <AntdIconExclamationCircleOutlined
                                      style={{ color: '' }}
                                      __component_name="AntdIconExclamationCircleOutlined"
                                    />
                                  )}
                                </Container>
                              </Tooltip>
                            </Space>
                          ))(__$$createChildContext(__$$context, { text, record, index })),
                        filters: __$$eval(() => this.utils.getComponentWarehouseStatus(this)),
                        dataIndex: 'status',
                      },
                      {
                        key: 'lastSuccessfulTime',
                        title: this.i18n('i18n-d9x7wf7j') /* 最新同步时间 */,
                        render: (text, record, index) =>
                          (__$$context => (
                            <Typography.Time
                              time={__$$eval(() => record?.lastSuccessfulTime)}
                              format=""
                              relativeTime={false}
                              __component_name="Typography.Time"
                            />
                          ))(__$$createChildContext(__$$context, { text, record, index })),
                        sorter: true,
                        dataIndex: 'lastSuccessfulTime',
                      },
                      {
                        key: 'creationTimestamp',
                        title: this.i18n('i18n-gjr2ewmb') /* 创建时间 */,
                        render: (text, record, index) =>
                          (__$$context => (
                            <Typography.Time
                              time={__$$eval(() => record?.creationTimestamp)}
                              format=""
                              relativeTime={false}
                              __component_name="Typography.Time"
                            />
                          ))(__$$createChildContext(__$$context, { text, record, index })),
                        sorter: true,
                        dataIndex: 'creationTimestamp',
                      },
                      {
                        title: this.i18n('i18n-ioy0ge9h') /* 操作 */,
                        render: (text, record, index) =>
                          (__$$context => (
                            <Space size={12} align="center" direction="horizontal">
                              <Button
                                href={__$$eval(
                                  () =>
                                    `/components/warehouse/${record?.name}?cluster=${__$$context.state.cluster}`
                                )}
                                block={false}
                                ghost={false}
                                shape="default"
                                danger={false}
                                disabled={false}
                                __component_name="Button"
                              >
                                {this.i18n('i18n-u4ajovin') /* 编辑 */}
                              </Button>
                              <Button
                                block={false}
                                ghost={false}
                                shape="default"
                                danger={false}
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
                                disabled={false}
                                __component_name="Button"
                              >
                                {this.i18n('i18n-lc4oie5j') /* 删除 */}
                              </Button>
                            </Space>
                          ))(__$$createChildContext(__$$context, { text, record, index })),
                        dataIndex: 'op',
                      },
                    ]}
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
                    dataSource={__$$eval(
                      () => this.props.useGetRepositories?.data?.repositories?.nodes || []
                    )}
                    pagination={false}
                    showHeader={true}
                    __component_name="Table"
                  />
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
        <Modal
          mask={true}
          onOk={function () {
            return this.confirmDeleteModal.apply(
              this,
              Array.prototype.slice.call(arguments).concat([])
            );
          }.bind(this)}
          open={__$$eval(() => this.state.isOpenModal && this.state.modalType === 'delete')}
          title={this.i18n('i18n-enfsxrze') /* 删除组件仓库 */}
          centered={false}
          keyboard={true}
          onCancel={function () {
            return this.closeModal.apply(this, Array.prototype.slice.call(arguments).concat([]));
          }.bind(this)}
          forceRender={false}
          maskClosable={false}
          confirmLoading={__$$eval(() => this.state.deleteLoading)}
          destroyOnClose={true}
          __component_name="Modal"
        >
          <Alert
            type="info"
            style={{}}
            message={
              <Space size={5} align="center" style={{}} direction="horizontal">
                <Typography.Text
                  style={{ fontSize: '' }}
                  strong={false}
                  disabled={false}
                  ellipsis={true}
                  __component_name="Typography.Text"
                >
                  {this.i18n('i18n-lc4oie5j') /* 删除 */}
                </Typography.Text>
                <Typography.Text
                  style={{ fontSize: '', maxWidth: '180px' }}
                  strong={true}
                  disabled={false}
                  ellipsis={{
                    rows: 1,
                    tooltip: {
                      title: __$$eval(() => this.state.record?.name || '-'),
                      _unsafe_MixedSetter_title_select: 'VariableSetter',
                    },
                  }}
                  __component_name="Typography.Text"
                >
                  {__$$eval(() => this.state.record?.name || '-')}
                </Typography.Text>
                <Typography.Text
                  style={{ fontSize: '' }}
                  strong={false}
                  disabled={false}
                  ellipsis={true}
                  __component_name="Typography.Text"
                >
                  {this.i18n('i18n-1y52u16q') /* 组件仓库，其下组件将同步删除，请确认！ */}
                </Typography.Text>
              </Space>
            }
            showIcon={true}
            __component_name="Alert"
          />
        </Modal>
      </Page>
    );
  }
}

const PageWrapper = () => {
  const location = useLocation();
  const history = getUnifiedHistory();
  const match = matchPath({ path: '/components/warehouse' }, location.pathname);
  history.match = match;
  history.query = qs.parse(location.search);
  const appHelper = {
    utils,
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
        func: 'undefined',
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
        <ComponentsWarehouse$$Page {...dataProps} self={self} appHelper={appHelper} />
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
  };
  childContext.__proto__ = oldContext;
  return childContext;
}
