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
import { DataProvider } from 'shared-components';

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
      current: 1,
      deleteLoading: false,
      filters: undefined,
      isNewer: undefined,
      isOpenModal: false,
      modalType: 'delete',
      pagination: undefined,
      record: {},
      searchKey: 'chartName',
      searchValue: undefined,
      size: 10,
      sorter: undefined,
    };
  }

  $ = () => null;

  $$ = () => [];

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
      await this.props.appHelper.utils.bff.removeSubscription({
        component: this.state.record?.component?.name,
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

  filterNew() {
    this.setState(
      {
        isNewer: !this.state.isNewer,
      },
      this.handleQueryChange
    );
  }

  getName(item) {
    item = item?.component || {};
    if (item.displayName) {
      return `${item.displayName}(${item.chartName || '-'})`;
    }
    return item.chartName || '-';
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
    const { latestVersion } = this.state.filters || {};
    const params = {
      page: this.state?.current || 1,
      pageSize: this.state?.pageSize || 10,
      chartName: undefined,
      repository: undefined,
      [this.state.searchKey]: this.state?.searchValue,
      cluster: this.utils.getAuthData()?.cluster,
      namespace: this.utils.getAuthData()?.project,
    };
    if (this.state.sorter?.order) {
      params.sortField = this.state.sorter?.field;
      params.sortDirection = this.state.sorter?.order;
    }
    if (!!latestVersion?.includes('isNewer')) {
      params.isNewer = true;
    } else {
      params.isNewer = undefined;
    }
    this.utils?.changeLocationQuery(this, 'useGetSubscriptionsPaged', params);
  }

  handleRefresh(event) {
    this.props.useGetSubscriptionsPaged?.mutate();
  }

  handleSearch(v) {
    this.setState(
      {
        current: 1,
      },
      this.handleQueryChange
    );
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

  handleSearchValueChange(e) {
    this.setState({
      searchValue: e.target.value,
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

  openDeleteModal(e, { record, type = 'delete' }) {
    this.setState({
      isOpenModal: true,
      modalType: 'delete',
      record,
    });
  }

  paginationShowTotal(total, range) {
    return `${this.i18n('i18n-wajqflwo')} ${total} ${this.i18n('i18n-7vre8aeh')}`;
  }

  componentDidMount() {}

  render() {
    const __$$context = this._context || this;
    const { state } = __$$context;
    return (
      <Page>
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
          title={this.i18n('i18n-vvx8a1xh') /* 取消订阅 */}
        >
          <Alert
            __component_name="Alert"
            message={
              <Row __component_name="Row" gutter={[0, 0]} wrap={true}>
                <Col __component_name="Col" span={24}>
                  {!!__$$eval(
                    () => this.state.record?.subscription?.componentPlanInstallMethod === 'auto'
                  ) && (
                    <Typography.Text
                      __component_name="Typography.Text"
                      disabled={false}
                      ellipsis={true}
                      strong={false}
                      style={{ fontSize: '' }}
                    >
                      {
                        this.i18n(
                          'i18n-iy3bimfg'
                        ) /* 取消订阅会同步修改组件更新方式为 <手动更新>。 */
                      }
                    </Typography.Text>
                  )}
                </Col>
                <Col __component_name="Col" span={24}>
                  <Space align="center" direction="horizontal" size={5}>
                    <Typography.Text
                      __component_name="Typography.Text"
                      disabled={false}
                      ellipsis={true}
                      strong={false}
                      style={{ fontSize: '' }}
                    >
                      {this.i18n('i18n-bwr35q3y') /* 确定取消订阅 */}
                    </Typography.Text>
                    <Typography.Text
                      __component_name="Typography.Text"
                      disabled={false}
                      ellipsis={{
                        rows: 1,
                        tooltip: {
                          _unsafe_MixedSetter_title_select: 'VariableSetter',
                          title: __$$eval(() => this.state.record?.chartName || '-'),
                        },
                      }}
                      strong={true}
                      style={{ fontSize: '', maxWidth: '330px' }}
                    >
                      {__$$eval(() => this.getName(this.state.record))}
                    </Typography.Text>
                    <Typography.Text
                      __component_name="Typography.Text"
                      disabled={false}
                      ellipsis={true}
                      strong={false}
                      style={{ fontSize: '' }}
                    >
                      {this.i18n('i18n-af854mop') /* 组件？ */}
                    </Typography.Text>
                  </Space>
                </Col>
              </Row>
            }
            showIcon={true}
            type="info"
          />
        </Modal>
        <Row __component_name="Row" wrap={true}>
          <Col __component_name="Col" span={24}>
            <Typography.Title
              __component_name="Typography.Title"
              bold={true}
              bordered={false}
              ellipsis={true}
              level={1}
            >
              {this.i18n('i18n-dggp27hd') /* 我订阅的 */}
            </Typography.Title>
          </Col>
          <Col __component_name="Col" span={24}>
            <Card
              __component_name="Card"
              actions={[]}
              bordered={false}
              hoverable={false}
              loading={false}
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
                          href="/components/market"
                          icon={<AntdIconPlusOutlined __component_name="AntdIconPlusOutlined" />}
                          shape="default"
                          target="_self"
                          type="primary"
                        >
                          {this.i18n('i18n-kp6j5zax') /* 组件订阅 */}
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
                          addonBefore={
                            <Select
                              __component_name="Select"
                              _sdkSwrGetFunc={{}}
                              allowClear={false}
                              disabled={false}
                              onChange={function () {
                                return this.handleSearchKeyChange.apply(
                                  this,
                                  Array.prototype.slice.call(arguments).concat([])
                                );
                              }.bind(this)}
                              options={[
                                {
                                  label: this.i18n('i18n-cuf6u4di') /* 组件名称 */,
                                  value: 'chartName',
                                },
                                {
                                  label: this.i18n('i18n-1po87kgw') /* 组件仓库 */,
                                  value: 'repository',
                                },
                              ]}
                              placeholder="请选择"
                              showSearch={true}
                              style={{ width: '90px' }}
                              value={__$$eval(() => this.state.searchKey)}
                            />
                          }
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
                          placeholder={this.i18n('i18n-n9a8du2a') /* 请输入 */}
                          style={{ width: '240px' }}
                          value={__$$eval(() => this.state.searchValue)}
                        />
                      </Space>
                    </Col>
                    <Col __component_name="Col">
                      <Space align="center" direction="horizontal">
                        <Pagination
                          __component_name="Pagination"
                          current={__$$eval(() => this.state.current)}
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
                          pageSize={__$$eval(() => this.state.size)}
                          showTotal={function () {
                            return this.paginationShowTotal.apply(
                              this,
                              Array.prototype.slice.call(arguments).concat([])
                            );
                          }.bind(this)}
                          simple={true}
                          total={__$$eval(
                            () =>
                              this.props.useGetSubscriptionsPaged?.data?.subscriptionsPaged
                                ?.totalCount || 0
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
                        dataIndex: 'chartName',
                        ellipsis: { showTitle: true },
                        key: 'chartName',
                        render: (text, record, index) =>
                          (__$$context => (
                            <UnifiedLink
                              __component_name="UnifiedLink"
                              target="_self"
                              to={__$$eval(
                                () =>
                                  `/components/market/subPage/management-detail/detail/${
                                    record?.repository
                                  }.${record?.component?.chartName}?cluster=${
                                    __$$context.utils.getAuthData()?.cluster
                                  }`
                              )}
                            >
                              {__$$eval(() => __$$context.getName(record))}
                            </UnifiedLink>
                          ))(__$$createChildContext(__$$context, { text, record, index })),
                        title: this.i18n('i18n-cuf6u4di') /* 组件名称 */,
                      },
                      {
                        _unsafe_MixedSetter_title_select: 'I18nSetter',
                        dataIndex: 'latestVersion',
                        filters: __$$eval(() => [
                          {
                            value: 'isNewer',
                            text: 'NEW',
                          },
                        ]),
                        key: 'latestVersion',
                        render: (text, record, index) =>
                          (__$$context => (
                            <Space __component_name="Space" align="center" direction="horizontal">
                              <Typography.Text
                                __component_name="Typography.Text"
                                disabled={false}
                                ellipsis={true}
                                strong={false}
                                style={{ fontSize: '' }}
                              >
                                {__$$eval(() => record?.component?.latestVersion || '-')}
                              </Typography.Text>
                              {!!__$$eval(() => record?.component?.isNewer) && (
                                <Tag __component_name="Tag" closable={false} color="success">
                                  NEW
                                </Tag>
                              )}
                            </Space>
                          ))(__$$createChildContext(__$$context, { text, record, index })),
                        title: this.i18n('i18n-7e7t3bw9') /* 版本 */,
                      },
                      {
                        dataIndex: 'repository',
                        key: 'repository',
                        render: (text, record, index) =>
                          (__$$context => (
                            <Typography.Text
                              __component_name="Typography.Text"
                              disabled={false}
                              ellipsis={true}
                              strong={false}
                              style={{ fontSize: '' }}
                            >
                              {__$$eval(() => record?.component?.repository || '-')}
                            </Typography.Text>
                          ))(__$$createChildContext(__$$context, { text, record, index })),
                        title: this.i18n('i18n-7lw9akor') /* 所属组件仓库 */,
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
                        title: this.i18n('i18n-i0sh94jn') /* 订阅时间 */,
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
                                {this.i18n('i18n-qsatji5h') /* 取消订阅 */}
                              </Button>
                            </Space>
                          ))(__$$createChildContext(__$$context, { text, record, index })),
                        title: this.i18n('i18n-ioy0ge9h') /* 操作 */,
                        width: 150,
                      },
                    ]}
                    dataSource={__$$eval(
                      () =>
                        this.props.useGetSubscriptionsPaged?.data?.subscriptionsPaged?.nodes || []
                    )}
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
                    pagination={false}
                    rowKey="chartName"
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
      </Page>
    );
  }
}

const PageWrapper = (props = {}) => {
  const location = useLocation();
  const history = getUnifiedHistory();
  const match = matchPath({ path: '/components/management/subscription' }, location.pathname);
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
        <ComponentsManagementSubscription$$Page
          {...props}
          {...dataProps}
          self={self}
          appHelper={appHelper}
        />
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
