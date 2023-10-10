// 注意: 出码引擎注入的临时变量默认都以 "__$$" 开头，禁止在搭建的代码中直接访问。
// 例外：react 框架的导出名和各种组件名除外。
import React from 'react';

import {
  Alert,
  Button,
  Card,
  Col,
  FormilyForm,
  FormilySelect,
  FormilyUpload,
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
  UnifiedLink,
} from '@tenx-ui/materials';

import {
  AntdIconPlusOutlined,
  AntdIconQuestionCircleOutlined,
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

class ComponentsManagementPublish$$Page extends React.Component {
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
      searchKey: 'chartName',
      pagination: undefined,
      isOpenModal: false,
      searchValue: undefined,
      modalLoading: false,
      uploadVisible: true,
      clusterLoading: true,
    };
  }

  $ = refName => {
    return this._refsManager.get(refName);
  };

  $$ = refName => {
    return this._refsManager.getAll(refName);
  };

  form(name) {
    return this.$(name || 'formily_create')?.formRef?.current?.form;
  }

  openModal(e, { record, type = 'delete' }) {
    this.setState(
      {
        isOpenModal: true,
        modalType: type,
        record,
        uploadVisible: true,
      },
      () => {
        setTimeout(() => {
          if (type === 'update') {
            this.form()?.setValues({
              repository: record?.repository,
            });
          }
        }, 200);
      }
    );
  }

  closeModal() {
    this.setState({
      isOpenModal: false,
    });
  }

  getCluster() {
    return this.state.cluster;
  }

  beforeUpload() {
    return false;
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
    this.props.useGetComponents?.mutate();
  }

  validatorFile(value) {
    if (!value && !this.state.data?.certData) {
      return this.i18n('i18n-aa3ink0n');
    }
    // // k
    // if (value?.file.size > 5*1000*) {
    //   return '文件不能大于 5M'
    // }
  }

  handleFileChange(v) {
    this.setState(
      {
        uploadVisible: !(v?.fileList?.length > 0),
      },
      () => {}
    );
  }

  handleQueryChange() {
    const { repositoryType, status } = this.state.filters || {};
    const params = {
      page: this.state?.current || 1,
      pageSize: this.state?.pageSize || 10,
      [this.state.searchKey]: this.state?.searchValue,
    };
    if (this.state.sorter?.order) {
      params.sortField = this.state.sorter?.field;
      params.sortDirection = this.state.sorter?.order;
    }
    if (this.state.cluster) {
      params.cluster = this.state.cluster;
    }
    // @todo
    // if (repositoryType?.length > 0) {
    //   params.repositoryTypes = repositoryType
    // }
    // if (status?.length > 0) {
    //   params.statuses = status
    // }
    this.utils?.changeLocationQuery(this, 'useGetComponents', params);
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

  async confirmCreateModal(e, payload) {
    const { modalType } = this.state;
    const iscreate = modalType === 'create';
    this.form().submit(async v => {
      this.setState({
        modalLoading: true,
      });
      const params = {
        repository: v?.repository,
        file: v.file?.fileList?.[0]?.originFileObj,
        cluster: this.getCluster(),
      };
      try {
        await this.props.appHelper.utils.bff.uploadComponent(params, {
          'Apollo-Require-Preflight': true,
        });
        this.closeModal();
        this.utils.notification.success({
          message: iscreate ? this.i18n('i18n-mrohje35') : this.i18n('i18n-pi0gpejn'),
        });
        this.props.useGetComponents.mutate();
        this.setState({
          modalLoading: false,
        });
      } catch (error) {
        this.setState({
          modalLoading: false,
        });
        this.utils.notification.warnings({
          message: iscreate ? this.i18n('i18n-o464lw0r') : this.i18n('i18n-b9vob3ep'),
          errors: error?.response?.errors,
        });
      }
    });
  }

  async confirmDeleteModal(e, payload) {
    this.setState({
      modalLoading: true,
    });
    try {
      await this.utils.bff.deleteComponent({
        chart: {
          chartName: this.state.record?.chartName,
          repository: this.state.record?.repository,
          versions: this.state.record?.versions?.map(item => item.version),
        },
        cluster: this.state.record?.cluster || this.getCluster(),
      });
      this.closeModal();
      this.utils.notification.success({
        message: this.i18n('i18n-6fr7wu19'),
      });
      this.props.useGetComponents.mutate();
      this.setState({
        modalLoading: false,
      });
    } catch (error) {
      this.setState({
        modalLoading: false,
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

  componentDidMount() {
    this.loadClusters();
  }

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
          style={{}}
          title={this.i18n('i18n-m91z1o9b') /* 删除组件 */}
          centered={false}
          keyboard={true}
          onCancel={function () {
            return this.closeModal.apply(this, Array.prototype.slice.call(arguments).concat([]));
          }.bind(this)}
          forceRender={false}
          maskClosable={false}
          confirmLoading={__$$eval(() => this.state.modalLoading)}
          destroyOnClose={true}
          __component_name="Modal"
        >
          <Alert
            type="info"
            message={
              <Space size={0} align="center" direction="horizontal">
                <Row wrap={true} gutter={[0, 0]} __component_name="Row">
                  <Col span={24} __component_name="Col">
                    <Typography.Text
                      style={{ fontSize: '' }}
                      strong={false}
                      disabled={false}
                      ellipsis={true}
                      __component_name="Typography.Text"
                    >
                      {
                        this.i18n(
                          'i18n-x8jvcd94'
                        ) /* 删除组件即删除其所有版本信息，删除后将不在<组件市场>展示。确定删除组件 */
                      }
                    </Typography.Text>
                  </Col>
                  <Col span={24} __component_name="Col">
                    <Space
                      size="small"
                      align="center"
                      direction="horizontal"
                      __component_name="Space"
                    >
                      <Typography.Text
                        style={{ maxWidth: '400px' }}
                        strong={false}
                        disabled={false}
                        ellipsis={{
                          rows: 1,
                          tooltip: {
                            title: __$$eval(() => this.state?.record?.name || '-'),
                            _unsafe_MixedSetter_title_select: 'VariableSetter',
                          },
                        }}
                        __component_name="Typography.Text"
                      >
                        {__$$eval(() => this.state?.record?.name || '-')}
                      </Typography.Text>
                      <Typography.Text
                        style={{ fontSize: '' }}
                        strong={false}
                        disabled={false}
                        ellipsis={true}
                        __component_name="Typography.Text"
                      >
                        {this.i18n('i18n-ha9unjy9') /* 吗？ */}
                      </Typography.Text>
                    </Space>
                  </Col>
                </Row>
              </Space>
            }
            showIcon={true}
            __component_name="Alert"
          />
        </Modal>
        <Modal
          mask={true}
          onOk={function () {
            return this.confirmCreateModal.apply(
              this,
              Array.prototype.slice.call(arguments).concat([])
            );
          }.bind(this)}
          open={__$$eval(
            () => ['create', 'update'].includes(this.state.modalType) && this.state.isOpenModal
          )}
          title={__$$eval(() =>
            this.state.modalType === 'create'
              ? this.i18n('i18n-uefj93m4')
              : this.i18n('i18n-gtwznpyj')
          )}
          centered={false}
          keyboard={true}
          onCancel={function () {
            return this.closeModal.apply(this, Array.prototype.slice.call(arguments).concat([]));
          }.bind(this)}
          forceRender={false}
          maskClosable={false}
          confirmLoading={__$$eval(() => this.state.modalLoading)}
          destroyOnClose={true}
          __component_name="Modal"
        >
          <FormilyForm
            ref={this._refsManager.linkRef('formily_create')}
            componentProps={{
              colon: false,
              layout: 'horizontal',
              labelCol: 5,
              labelAlign: 'left',
              wrapperCol: 20,
            }}
            __component_name="FormilyForm"
          >
            <FormilySelect
              fieldProps={{
                enum: __$$eval(
                  () =>
                    this.props.useGetRepositoriesAll?.data?.repositoriesAll?.map(item => ({
                      value: item.name,
                      label: item.name,
                    })) || []
                ),
                name: 'repository',
                title: (
                  <Space align="center" style={{}} direction="horizontal">
                    <Typography.Text
                      style={{ fontSize: '' }}
                      strong={false}
                      disabled={false}
                      ellipsis={false}
                      __component_name="Typography.Text"
                    >
                      {this.i18n('i18n-1po87kgw') /* 组件仓库 */}
                    </Typography.Text>
                    <Tooltip
                      title={
                        this.i18n(
                          'i18n-2izsqnki'
                        ) /* 现只支持手动发布组件到Chart Museum类型的组件仓库 */
                      }
                      __component_name="Tooltip"
                    >
                      <AntdIconQuestionCircleOutlined
                        style={{ color: '#737373' }}
                        __component_name="AntdIconQuestionCircleOutlined"
                      />
                    </Tooltip>
                  </Space>
                ),
                required: true,
                description: '',
                'x-validator': [],
                _unsafe_MixedSetter_enum_select: 'ExpressionSetter',
                _unsafe_MixedSetter_title_select: 'SlotSetter',
              }}
              componentProps={{
                'x-component-props': {
                  disabled: __$$eval(() => this.state.modalType === 'update'),
                  allowClear: false,
                  placeholder: this.i18n('i18n-ydshspew') /* 请选择组件仓库 */,
                  _sdkSwrGetFunc: {},
                },
              }}
              decoratorProps={{ 'x-decorator-props': { tooltip: '' } }}
              __component_name="FormilySelect"
            />
            <FormilyUpload
              fieldProps={{
                name: 'file',
                title: this.i18n('i18n-as2xi3jn') /* 组件helm包 */,
                required: false,
                'x-component': 'FormilyUpload',
                'x-validator': [
                  {
                    id: 'disabled',
                    type: 'disabled',
                    children: '未知',
                    validator: function () {
                      return this.validatorFile.apply(
                        this,
                        Array.prototype.slice.call(arguments).concat([])
                      );
                    }.bind(this),
                  },
                ],
              }}
              componentProps={{
                'x-component-props': {
                  accept: '.zip,.rar,.7z,.tar,.gz,.bz2,.tgz',
                  maxCount: 1,
                  onChange: function () {
                    return this.handleFileChange.apply(
                      this,
                      Array.prototype.slice.call(arguments).concat([])
                    );
                  }.bind(this),
                  beforeUpload: function () {
                    return this.beforeUpload.apply(
                      this,
                      Array.prototype.slice.call(arguments).concat([])
                    );
                  }.bind(this),
                },
              }}
              decoratorProps={{ 'x-decorator-props': { asterisk: true } }}
              __component_name="FormilyUpload"
            >
              {!!__$$eval(() => this.state.uploadVisible) && (
                <Row
                  wrap={true}
                  style={{
                    width: '374px',
                    border: '1px dashed rgba(217, 217, 217)',
                    cursor: 'pointer',
                    height: '180px',
                    margin: 'auto',
                    display: 'flex',
                    paddingTop: '56px',
                    borderRadius: '4px',
                  }}
                  gutter={[0, 0]}
                  __component_name="Row"
                >
                  <Col
                    span={24}
                    style={{ height: '30px', display: 'flex', justifyContent: 'center' }}
                    __component_name="Col"
                  >
                    <AntdIconPlusOutlined
                      style={{ color: '#bbbbbb', fontSize: '16px', marginBottom: '-1px' }}
                      __component_name="AntdIconPlusOutlined"
                    />
                  </Col>
                  <Col span={24} __component_name="Col">
                    <Row wrap={true} style={{}} gutter={[0, 8]} __component_name="Row">
                      <Col
                        span={24}
                        style={{
                          display: 'flex',
                          marginTop: '-40px',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        __component_name="Col"
                      >
                        <Typography.Text
                          style={{ fontSize: '' }}
                          strong={false}
                          disabled={false}
                          ellipsis={true}
                          __component_name="Typography.Text"
                        >
                          {this.i18n('i18n-xsqa11zo') /* 点击或将 Helm 包拖拽到这里导入 */}
                        </Typography.Text>
                      </Col>
                      <Col
                        span={24}
                        style={{
                          display: 'flex',
                          marginTop: '-20px',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        __component_name="Col"
                      >
                        {!!false && (
                          <Typography.Text
                            style={{ fontSize: '' }}
                            strong={false}
                            disabled={false}
                            ellipsis={true}
                            __component_name="Typography.Text"
                          >
                            {this.i18n('i18n-v8h9dmhm') /* 大小 1M 以内 */}
                          </Typography.Text>
                        )}
                      </Col>
                      <Col
                        span={24}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        __component_name="Col"
                      />
                    </Row>
                  </Col>
                </Row>
              )}
            </FormilyUpload>
          </FormilyForm>
        </Modal>
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
                  {this.i18n('i18n-u7cfx5g4') /* 我发布的 */}
                </Typography.Title>
              </Col>
              <Col __component_name="Col">
                <Select
                  style={{ width: 200 }}
                  value={__$$eval(() => this.getCluster())}
                  options={__$$eval(() => this.state.clusters)}
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
                          href=""
                          icon={<AntdIconPlusOutlined __component_name="AntdIconPlusOutlined" />}
                          type="primary"
                          block={false}
                          ghost={false}
                          shape="default"
                          danger={false}
                          target="_self"
                          onClick={function () {
                            return this.openModal.apply(
                              this,
                              Array.prototype.slice.call(arguments).concat([
                                {
                                  record: undefined,
                                  type: 'create',
                                },
                              ])
                            );
                          }.bind(this)}
                          disabled={false}
                          __component_name="Button"
                        >
                          {this.i18n('i18n-4jc9ptx8') /* 组件发布 */}
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
                              style={{ width: '90px', textAlign: 'left' }}
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
                        {!!false && (
                          <Input.Search
                            ref={this._refsManager.linkRef('input.search-28a8414d')}
                            style={{ width: '240px' }}
                            onSearch={function () {
                              return this.handleSearchValueChange.apply(
                                this,
                                Array.prototype.slice.call(arguments).concat([])
                              );
                            }.bind(this)}
                            placeholder={this.i18n('i18n-8571905l') /*  请输入组件名称/组件仓库 */}
                            __component_name="Input.Search"
                          />
                        )}
                      </Space>
                    </Col>
                    <Col __component_name="Col">
                      <Space align="center" direction="horizontal">
                        <Pagination
                          total={__$$eval(
                            () => this.props.useGetComponents?.data?.components?.totalCount || 0
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
                    size="middle"
                    rowKey="name"
                    scroll={{ scrollToFirstRowOnChange: true }}
                    columns={[
                      {
                        key: 'name',
                        title: this.i18n('i18n-cuf6u4di') /* 组件名称 */,
                        render: (text, record, index) =>
                          (__$$context => (
                            <UnifiedLink
                              to={__$$eval(
                                () =>
                                  `/components/management/publish/management-detail/detail/${
                                    record?.name
                                  }?cluster=${__$$context.getCluster()}`
                              )}
                              target="_self"
                              __component_name="UnifiedLink"
                            >
                              {__$$eval(() => record?.chartName || '-')}
                            </UnifiedLink>
                          ))(__$$createChildContext(__$$context, { text, record, index })),
                        ellipsis: { showTitle: true },
                        dataIndex: 'name',
                      },
                      {
                        title: this.i18n('i18n-vpbgp1lj') /* 最新版本 */,
                        render: (text, record, index) =>
                          (__$$context => (
                            <Typography.Text
                              style={{ fontSize: '' }}
                              strong={false}
                              disabled={false}
                              ellipsis={true}
                              __component_name="Typography.Text"
                            >
                              {__$$eval(() => record?.latestVersion || '-')}
                            </Typography.Text>
                          ))(__$$createChildContext(__$$context, { text, record, index })),
                        dataIndex: 'version',
                      },
                      {
                        key: 'chartName',
                        title: this.i18n('i18n-1po87kgw') /* 组件仓库 */,
                        dataIndex: 'repository',
                      },
                      {
                        key: 'status',
                        title: this.i18n('i18n-o48ciymn') /* 当前状态 */,
                        render: (text, record, index) =>
                          (__$$context => (
                            <Status
                              id={__$$eval(() => record?.status)}
                              types={__$$eval(() =>
                                __$$context.utils.getComponentPublishStatus(__$$context, true)
                              )}
                              __component_name="Status"
                            />
                          ))(__$$createChildContext(__$$context, { text, record, index })),
                        dataIndex: 'status',
                      },
                      {
                        key: 'updatetime',
                        title: this.i18n('i18n-m6kwhtjg') /* 更新时间 */,
                        render: (text, record, index) =>
                          (__$$context => (
                            <Typography.Time
                              time={__$$eval(() => record.updatedAt)}
                              format=""
                              relativeTime={false}
                              __component_name="Typography.Time"
                            />
                          ))(__$$createChildContext(__$$context, { text, record, index })),
                        sorter: true,
                        dataIndex: 'updatedAt',
                      },
                      {
                        title: this.i18n('i18n-ioy0ge9h') /* 操作 */,
                        render: (text, record, index) =>
                          (__$$context => (
                            <Space size={12} align="center" direction="horizontal">
                              <Button
                                block={false}
                                ghost={false}
                                shape="default"
                                danger={false}
                                onClick={function () {
                                  return this.openModal.apply(
                                    this,
                                    Array.prototype.slice.call(arguments).concat([
                                      {
                                        record: record,
                                        type: 'update',
                                      },
                                    ])
                                  );
                                }.bind(__$$context)}
                                disabled={false}
                                __component_name="Button"
                              >
                                {this.i18n('i18n-8ign6rmf') /* 更新 */}
                              </Button>
                              <Button
                                block={false}
                                ghost={false}
                                shape="default"
                                danger={false}
                                onClick={function () {
                                  return this.openModal.apply(
                                    this,
                                    Array.prototype.slice.call(arguments).concat([
                                      {
                                        record: record,
                                        type: 'delete',
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
                        this.props.useGetComponents?.isLoading ||
                        this.props?.useGetComponents?.loading ||
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
                      () => this.props.useGetComponents?.data?.components?.nodes || []
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
  const match = matchPath({ path: '/components/management/publish' }, location.pathname);
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
          func: 'useGetComponents',
          params: undefined,
          enableLocationSearch: function applyThis() {
            return true;
          }.apply(self),
        },
        {
          func: 'useGetRepositoriesAll',
          params: undefined,
          enableLocationSearch: undefined,
        },
      ]}
      render={dataProps => (
        <ComponentsManagementPublish$$Page {...dataProps} self={self} appHelper={appHelper} />
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
