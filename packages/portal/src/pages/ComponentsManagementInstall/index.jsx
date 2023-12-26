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
  Tag,
  Tooltip,
  Typography,
  UnifiedLink,
} from '@tenx-ui/materials';

import {
  AntdIconExclamationCircleFilled,
  AntdIconPlusOutlined,
  AntdIconReloadOutlined,
} from '@tenx-ui/icon-materials';

import { getUnifiedHistory } from '@tenx-ui/utils/es/UnifiedLink/index.prod';
import { matchPath, useLocation } from '@umijs/max';
import qs from 'query-string';
import { DataProvider } from 'shared-components';

import utils from '../../utils/__utils';

import * as __$$i18n from '../../i18n';

import __$$constants from '../../__constants';

import './index.css';

class ComponentsManagementInstall$$Page extends React.Component {
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
      await this.props.appHelper.utils.bff.deleteComponentplan({
        name: this.state.record?.name,
        cluster: this.utils.getAuthData()?.cluster,
        namespace: this.utils.getAuthData()?.project,
      });
      setTimeout(() => {
        this.closeModal();
        this.utils.notification.success({
          message: this.i18n('i18n-tzpk8q9e'),
        });
        this.props.useGetComponentplansPaged.mutate();
        this.setState({
          deleteLoading: false,
        });
      }, 300);
    } catch (error) {
      this.setState({
        deleteLoading: false,
      });
      this.utils.notification.warnings({
        message: this.i18n('i18n-scjgw2wj'),
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
    item = {
      ...(item || {}),
      ...(item?.component || {}),
    };
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
    const { status, version } = this.state.filters || {};
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
    if (!!version?.includes('isNewer')) {
      params.isNewer = true;
    } else {
      params.isNewer = undefined;
    }
    if (status?.length > 0) {
      params.status = status;
    } else {
      params.status = undefined;
    }
    this.utils?.changeLocationQuery(this, 'useGetComponentplansPaged', params);
  }

  handleRefresh(event) {
    this.props.useGetComponentplansPaged?.mutate();
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
          style={{}}
          title={this.i18n('i18n-bflyklsf') /* 卸载组件 */}
          width="550px"
        >
          <Alert
            __component_name="Alert"
            message={
              <Row __component_name="Row" gutter={[0, 0]} wrap={true}>
                <Col __component_name="Col" span={24}>
                  <Typography.Text
                    __component_name="Typography.Text"
                    disabled={false}
                    ellipsis={true}
                    strong={false}
                    style={{ fontSize: '' }}
                  >
                    {this.i18n('i18n-gctiukaj') /* 卸载组件会同步删除其所有历史版本信息。 */}
                  </Typography.Text>
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
                      {this.i18n('i18n-z9a1zfy4') /* 确定卸载 */}
                    </Typography.Text>
                    <Typography.Text
                      __component_name="Typography.Text"
                      disabled={false}
                      ellipsis={{
                        rows: 1,
                        tooltip: {
                          _unsafe_MixedSetter_title_select: 'VariableSetter',
                          title: __$$eval(() => this.state?.record?.releaseName || '-'),
                        },
                      }}
                      strong={true}
                      style={{ fontSize: '', maxWidth: '350px' }}
                    >
                      {__$$eval(() => this.state?.record?.releaseName || '-')}
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
            style={{ width: '500px' }}
            type="warning"
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
              {this.i18n('i18n-256hns5m') /* 我安装的 */}
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
                          {this.i18n('i18n-ayt8tml3') /* 安装组件 */}
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
                              this.props.useGetComponentplansPaged?.data?.componentplansPaged
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
                        dataIndex: 'releaseName',
                        ellipsis: { showTitle: true },
                        key: 'releaseName',
                        render: (text, record, index) =>
                          (__$$context => (
                            <UnifiedLink
                              __component_name="UnifiedLink"
                              target="_self"
                              to={__$$eval(
                                () => `/components/management/install/detail/${record.name}`
                              )}
                            >
                              {__$$eval(() => record.releaseName || '-')}
                            </UnifiedLink>
                          ))(__$$createChildContext(__$$context, { text, record, index })),
                        title: this.i18n('i18n-wwsgwkdl') /* 部署名称 */,
                      },
                      {
                        dataIndex: 'name',
                        key: 'name',
                        render: (text, record, index) =>
                          (__$$context => (
                            <Typography.Text
                              __component_name="Typography.Text"
                              disabled={false}
                              ellipsis={true}
                              strong={false}
                              style={{ fontSize: '' }}
                            >
                              {__$$eval(() => __$$context.getName(__$$context?.record?.component))}
                            </Typography.Text>
                          ))(__$$createChildContext(__$$context, { text, record, index })),
                        title: this.i18n('i18n-cuf6u4di') /* 组件名称 */,
                      },
                      {
                        _unsafe_MixedSetter_title_select: 'I18nSetter',
                        dataIndex: 'version',
                        filters: __$$eval(() => [
                          {
                            value: 'isNewer',
                            text: 'NEW',
                          },
                        ]),
                        key: 'version',
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
                                {__$$eval(() => record.version || '-')}
                              </Typography.Text>
                              {!!__$$eval(() => record?.component?.isNewer) && (
                                <Tag __component_name="Tag" closable={false} color="success">
                                  New
                                </Tag>
                              )}
                            </Space>
                          ))(__$$createChildContext(__$$context, { text, record, index })),
                        title: this.i18n('i18n-7e7t3bw9') /* 版本 */,
                      },
                      {
                        dataIndex: 'status',
                        filters: __$$eval(() => this.utils.getComponentInstallStatus(this)),
                        key: 'status',
                        render: (text, record, index) =>
                          (__$$context => (
                            <Space __component_name="Space" align="center" direction="horizontal">
                              <Status
                                __component_name="Status"
                                id={__$$eval(() => record.status)}
                                types={__$$eval(() =>
                                  __$$context.utils.getComponentInstallStatus(__$$context, true)
                                )}
                              />
                              {!!__$$eval(() => record.reason) && (
                                <Tooltip
                                  __component_name="Tooltip"
                                  title={__$$eval(() => record?.reason || '-')}
                                >
                                  <Container
                                    __component_name="Container"
                                    color="colorTextDescription"
                                  >
                                    <AntdIconExclamationCircleFilled __component_name="AntdIconExclamationCircleFilled" />
                                  </Container>
                                </Tooltip>
                              )}
                            </Space>
                          ))(__$$createChildContext(__$$context, { text, record, index })),
                        title: this.i18n('i18n-kmaug6a7') /* 状态 */,
                      },
                      {
                        dataIndex: 'type',
                        key: 'type',
                        render: (text, record, index) =>
                          (__$$context => (
                            <Typography.Text
                              __component_name="Typography.Text"
                              disabled={false}
                              ellipsis={true}
                              strong={false}
                              style={{ fontSize: '' }}
                            >
                              {__$$eval(
                                () =>
                                  __$$context.utils
                                    .getComponentInstallMethods(__$$context)
                                    ?.find(
                                      item =>
                                        item.value ===
                                        (record?.subscription?.componentPlanInstallMethod ||
                                          'manual')
                                    )?.text
                              )}
                            </Typography.Text>
                          ))(__$$createChildContext(__$$context, { text, record, index })),
                        title: this.i18n('i18n-5u3ohmy6') /* 更新方式 */,
                      },
                      {
                        dataIndex: 'repository',
                        render: (text, record, index) =>
                          (__$$context => (
                            <Typography.Text
                              __component_name="Typography.Text"
                              disabled={false}
                              ellipsis={true}
                              strong={false}
                              style={{ fontSize: '' }}
                            >
                              {__$$eval(() => __$$context?.record?.component?.repository || '-')}
                            </Typography.Text>
                          ))(__$$createChildContext(__$$context, { text, record, index })),
                        title: this.i18n('i18n-7lw9akor') /* 所属组件仓库 */,
                      },
                      {
                        dataIndex: 'creationTimestamp',
                        key: 'updatetime',
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
                        title: this.i18n('i18n-m6kwhtjg') /* 更新时间 */,
                      },
                      {
                        dataIndex: 'op',
                        render: (text, record, index) =>
                          (__$$context => (
                            <Space align="center" direction="horizontal" size={12}>
                              <Space __component_name="Space" align="center" direction="horizontal">
                                {!!__$$eval(() => record.status !== 'Installing') && (
                                  <Button
                                    __component_name="Button"
                                    block={false}
                                    danger={false}
                                    disabled={false}
                                    ghost={false}
                                    href={__$$eval(
                                      () =>
                                        `/components/management/install/management-action/update/${
                                          record?.component?.name
                                        }?cluster=${
                                          __$$context.utils.getAuthData()?.cluster
                                        }&name=${record?.name}`
                                    )}
                                    shape="default"
                                  >
                                    {__$$eval(() =>
                                      record?.status === 'InstallSuccess'
                                        ? __$$context.i18n('i18n-8ign6rmf')
                                        : __$$context.i18n('i18n-wvdg2via')
                                    )}
                                  </Button>
                                )}
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
                                  {this.i18n('i18n-dj53cnrp') /* 卸载 */}
                                </Button>
                              </Space>
                            </Space>
                          ))(__$$createChildContext(__$$context, { text, record, index })),
                        title: this.i18n('i18n-ioy0ge9h') /* 操作 */,
                        width: 200,
                      },
                    ]}
                    dataSource={__$$eval(
                      () =>
                        this.props.useGetComponentplansPaged?.data?.componentplansPaged?.nodes || []
                    )}
                    loading={__$$eval(
                      () =>
                        this.props.useGetComponentplansPaged?.isLoading ||
                        this.props?.useGetComponentplansPaged?.loading ||
                        false
                    )}
                    onChange={function () {
                      return this.handleTableChange.apply(
                        this,
                        Array.prototype.slice.call(arguments).concat([])
                      );
                    }.bind(this)}
                    pagination={false}
                    rowKey="releaseName"
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
  const match = matchPath({ path: '/components/management/install' }, location.pathname);
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
          func: 'useGetComponentplansPaged',
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
        <ComponentsManagementInstall$$Page
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
