// 注意: 出码引擎注入的临时变量默认都以 "__$$" 开头，禁止在搭建的代码中直接访问。
// 例外：react 框架的导出名和各种组件名除外。
import React from 'react';

import {
  Alert,
  Button,
  Card,
  Col,
  Input,
  Modal,
  Page,
  Pagination,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Typography,
  UnifiedLink,
} from '@tenx-ui/materials';

import { AntdIconPlusOutlined, AntdIconReloadOutlined } from '@tenx-ui/icon-materials';

import { getUnifiedHistory } from '@tenx-ui/utils/es/UnifiedLink/index.prod';
import { matchPath, useLocation } from '@umijs/max';
import qs from 'query-string';
import DataProvider from '../../components/DataProvider';

import utils from '../../utils/__utils';

import * as __$$i18n from '../../i18n';

import __$$constants from '../../__constants';

import './index.css';

class ComponentsManagementSubscription$$Page extends React.Component {
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

    __$$i18n._inject2(this);

    this.state = {
      size: 10,
      record: {},
      sorter: undefined,
      current: 1,
      filters: undefined,
      modalType: 'delete',
      searchKey: 'chartName',
      pagination: undefined,
      isOpenModal: false,
      searchValue: undefined,
      deleteLoading: false,
    };
  }

  $ = () => null;

  $$ = () => [];

  closeModal() {
    this.setState({
      isOpenModal: false,
    });
  }

  handleSearch(v) {
    this.setState(
      {
        current: 1,
      },
      this.handleQueryChange
    );
  }

  handleRefresh(event) {
    this.props.useGetSubscriptionsPaged?.mutate();
  }

  openDeleteModal(e, { record, type = 'delete' }) {
    this.setState({
      isOpenModal: true,
      modalType: 'delete',
      record,
    });
  }

  handleQueryChange() {
    const {} = this.state.filters || {};
    const params = {
      page: this.state?.current || 1,
      pageSize: this.state?.pageSize || 10,
      [this.state.searchKey]: this.state?.searchValue,
      cluster: this.utils.getAuthData()?.cluster,
      namespace: this.utils.getAuthData()?.project,
    };
    if (this.state.sorter?.order) {
      params.sortField = this.state.sorter?.field;
      params.sortDirection = this.state.sorter?.order;
    }
    this.utils?.changeLocationQuery(this, 'useGetSubscriptionsPaged', params);
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
      await this.props.appHelper.utils.bff.deleteSubscription({
        name: this.state.record?.name,
        cluster: this.utils.getAuthData()?.cluster,
        namespace: this.utils.getAuthData()?.project,
      });
      this.closeModal();
      this.utils.notification.success({
        message: this.i18n('i18n-009db47v'),
      });
      this.props.useGetSubscriptionsPaged.mutate();
      this.setState({
        deleteLoading: false,
      });
    } catch (error) {
      this.setState({
        deleteLoading: false,
      });
      this.utils.notification.warnings({
        message: this.i18n('i18n-5sfz7uqe'),
        errors: error?.response?.errors,
      });
    }
  }

  paginationShowTotal(total, range) {
    return `${this.i18n('i18n-wajqflwo')} ${total} ${this.i18n('i18n-7vre8aeh')}`;
  }

  handleSearchKeyChange(v) {
    this.setState(
      {
        searchValue: undefined,
        current: 1,
        searchKey: v,
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

  handleSearchValueChange(e) {
    this.setState({
      searchValue: e.target.value,
    });
  }

  componentDidMount() {}

  render() {
    const __$$context = this._context || this;
    const { state } = __$$context;
    return (
      <Page>
        <Modal
          mask={true}
          onOk={function () {
            return this.confirmDeleteModal.apply(
              this,
              Array.prototype.slice.call(arguments).concat([])
            );
          }.bind(this)}
          open={__$$eval(() => this.state.isOpenModal && this.state.modalType === 'delete')}
          title={this.i18n('i18n-vvx8a1xh') /* 取消订阅 */}
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
            message={
              <Row wrap={true} gutter={[0, 0]} __component_name="Row">
                <Col span={24} __component_name="Col">
                  {!!__$$eval(() => this.state.record?.componentPlanInstallMethod === 'auto') && (
                    <Typography.Text
                      style={{ fontSize: '' }}
                      strong={false}
                      disabled={false}
                      ellipsis={true}
                      __component_name="Typography.Text"
                    >
                      {
                        this.i18n(
                          'i18n-iy3bimfg'
                        ) /* 取消订阅会同步修改组件更新方式为 <手动更新>。 */
                      }
                    </Typography.Text>
                  )}
                </Col>
                <Col span={24} __component_name="Col">
                  <Space size={0} align="center" direction="horizontal">
                    <Typography.Text
                      style={{ fontSize: '' }}
                      strong={false}
                      disabled={false}
                      ellipsis={true}
                      __component_name="Typography.Text"
                    >
                      {this.i18n('i18n-bwr35q3y') /* 确定取消订阅 */}
                    </Typography.Text>
                    <Typography.Text
                      style={{ fontSize: '' }}
                      strong={false}
                      disabled={false}
                      ellipsis={true}
                      __component_name="Typography.Text"
                    >
                      {__$$eval(() => this.state.record?.chartName || '-')}
                    </Typography.Text>
                    <Typography.Text
                      style={{ fontSize: '' }}
                      strong={false}
                      disabled={false}
                      ellipsis={true}
                      __component_name="Typography.Text"
                    >
                      {this.i18n('i18n-af854mop') /* 组件？ */}
                    </Typography.Text>
                  </Space>
                </Col>
              </Row>
            }
            showIcon={true}
            __component_name="Alert"
          />
        </Modal>
        <Row wrap={true} __component_name="Row">
          <Col span={24} __component_name="Col">
            <Typography.Title
              bold={true}
              level={1}
              bordered={false}
              ellipsis={true}
              __component_name="Typography.Title"
            >
              {this.i18n('i18n-dggp27hd') /* 我订阅的 */}
            </Typography.Title>
          </Col>
          <Col span={24} __component_name="Col">
            <Card
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
                          href="/components/market"
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
                          {this.i18n('i18n-kp6j5zax') /* 组件订阅 */}
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
                          addonBefore={
                            <Select
                              style={{ width: '90px' }}
                              value={__$$eval(() => this.state.searchKey)}
                              options={[
                                {
                                  label: this.i18n('i18n-x25agmsc') /* 名称 */,
                                  value: 'chartName',
                                },
                                {
                                  label: this.i18n('i18n-1po87kgw') /* 组件仓库 */,
                                  value: 'repository',
                                },
                              ]}
                              disabled={false}
                              onChange={function () {
                                return this.handleSearchKeyChange.apply(
                                  this,
                                  Array.prototype.slice.call(arguments).concat([])
                                );
                              }.bind(this)}
                              allowClear={false}
                              showSearch={true}
                              placeholder="请选择"
                              _sdkSwrGetFunc={{}}
                              __component_name="Select"
                            />
                          }
                          placeholder={this.i18n('i18n-n9a8du2a') /* 请输入 */}
                          __component_name="Input.Search"
                        />
                      </Space>
                    </Col>
                    <Col __component_name="Col">
                      <Space align="center" direction="horizontal">
                        <Pagination
                          total={__$$eval(
                            () =>
                              this.props.useGetSubscriptionsPaged?.data?.subscriptionsPaged
                                ?.totalCount || 0
                          )}
                          simple={true}
                          current={__$$eval(() => this.state.current)}
                          onChange={function () {
                            return this.handlePaginationChange.apply(
                              this,
                              Array.prototype.slice.call(arguments).concat([])
                            );
                          }.bind(this)}
                          pageSize={__$$eval(() => this.state.size)}
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
                    size="default"
                    rowKey="chartName"
                    scroll={{ scrollToFirstRowOnChange: true }}
                    columns={[
                      {
                        key: 'chartName',
                        title: this.i18n('i18n-cuf6u4di') /* 组件名称 */,
                        render: (text, record, index) =>
                          (__$$context => (
                            <UnifiedLink
                              to={__$$eval(
                                () =>
                                  `/components/market/subPage/management-detail/detail/${
                                    record?.repository
                                  }.${record?.chartName}?cluster=${
                                    __$$context.utils.getAuthData()?.cluster
                                  }`
                              )}
                              target="_self"
                              __component_name="UnifiedLink"
                            >
                              {__$$eval(() => record?.chartName || '-')}
                            </UnifiedLink>
                          ))(__$$createChildContext(__$$context, { text, record, index })),
                        ellipsis: { showTitle: true },
                        dataIndex: 'chartName',
                      },
                      {
                        key: 'latestVersion',
                        title: this.i18n('i18n-7e7t3bw9') /* 版本 */,
                        render: (text, record, index) =>
                          (__$$context => (
                            <Space align="center" direction="horizontal" __component_name="Space">
                              <Typography.Text
                                style={{ fontSize: '' }}
                                strong={false}
                                disabled={false}
                                ellipsis={true}
                                __component_name="Typography.Text"
                              >
                                {__$$eval(() => record?.latestVersion || '-')}
                              </Typography.Text>
                              {!!__$$eval(
                                () =>
                                  (new Date().getTime() - new Date(record?.updatedAt).getTime()) /
                                    1000 /
                                    60 /
                                    60 /
                                    24 <
                                  7
                              ) && (
                                <Tag color="success" closable={false} __component_name="Tag">
                                  NEW
                                </Tag>
                              )}
                            </Space>
                          ))(__$$createChildContext(__$$context, { text, record, index })),
                        dataIndex: 'latestVersion',
                      },
                      {
                        key: 'repository',
                        title: this.i18n('i18n-7lw9akor') /* 所属组件仓库 */,
                        dataIndex: 'repository',
                      },
                      {
                        key: 'creationTimestamp',
                        title: this.i18n('i18n-i0sh94jn') /* 订阅时间 */,
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
                        width: 120,
                        render: (text, record, index) =>
                          (__$$context => (
                            <Space size={12} align="center" direction="horizontal">
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
                                {this.i18n('i18n-qsatji5h') /* 取消订阅 */}
                              </Button>
                            </Space>
                          ))(__$$createChildContext(__$$context, { text, record, index })),
                        dataIndex: 'op',
                      },
                    ]}
                    loading={__$$eval(
                      () =>
                        this.props.useGetSubscriptionsPaged?.isLoading ||
                        this.props?.useGetSubscriptionsPaged?.loading ||
                        false
                    )}
                    onChange={function () {
                      return this.handleTableChange.apply(
                        this,
                        Array.prototype.slice.call(arguments).concat([])
                      );
                    }.bind(this)}
                    dataSource={__$$eval(
                      () =>
                        this.props.useGetSubscriptionsPaged?.data?.subscriptionsPaged?.nodes || 0
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
      </Page>
    );
  }
}

const PageWrapper = () => {
  const location = useLocation();
  const history = getUnifiedHistory();
  const match = matchPath({ path: '/components/management/subscription' }, location.pathname);
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
          func: 'useGetSubscriptionsPaged',
          params: function applyThis() {
            return {
              namespace: this.utils.getAuthData()?.project,
              cluster: this.utils.getAuthData()?.cluster,
            };
          }.apply(self),
          enableLocationSearch: function applyThis() {
            return true;
          }.apply(self),
        },
      ]}
      render={dataProps => (
        <ComponentsManagementSubscription$$Page {...dataProps} self={self} appHelper={appHelper} />
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
