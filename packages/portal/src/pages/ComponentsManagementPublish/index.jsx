// 注意: 出码引擎注入的临时变量默认都以 "__$$" 开头，禁止在搭建的代码中直接访问。
// 例外：react 框架的导出名和各种组件名除外。
import React from 'react';

import {
  Alert,
  Button,
  Card,
  Col,
  Container,
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
      cluster: undefined,
      clusterLoading: true,
      clusters: undefined,
      current: 1,
      filters: undefined,
      isOpenModal: false,
      modalLoading: false,
      modalType: 'delete',
      pagination: undefined,
      record: {},
      searchKey: 'chartName',
      searchValue: undefined,
      size: 10,
      sorter: undefined,
      uploadVisible: true,
    };
  }

  $ = refName => {
    return this._refsManager.get(refName);
  };

  $$ = refName => {
    return this._refsManager.getAll(refName);
  };

  beforeUpload() {
    return false;
  }

  closeModal() {
    this.setState({
      isOpenModal: false,
    });
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

  form(name) {
    return this.$(name || 'formily_create')?.formRef?.current?.form;
  }

  getCluster() {
    return this.state.cluster;
  }

  getName(item) {
    item = item || {};
    if (item.displayName) {
      return `${item.displayName}(${item.chartName || '-'})`;
    }
    return item.chartName || '-';
  }

  handleClusterChange(v) {
    this.setState(
      {
        cluster: v,
      },
      this.handleQueryChange
    );
  }

  handleFileChange(v) {
    this.setState(
      {
        uploadVisible: !(v?.fileList?.length > 0),
      },
      () => {}
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
      chartName: undefined,
      repository: undefined,
      repositoryType: 'chartmuseum',
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

  handleRefresh(event) {
    this.props.useGetComponents?.mutate();
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

  paginationShowTotal(total, range) {
    return `${this.i18n('i18n-wajqflwo')} ${total} ${this.i18n('i18n-7vre8aeh')}`;
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

  componentDidMount() {
    this.loadClusters();
  }

  render() {
    const __$$context = this._context || this;
    const { state } = __$$context;
    return (
      <Page>
        <Modal
          __component_name="Modal"
          centered={false}
          confirmLoading={__$$eval(() => this.state.modalLoading)}
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
          title={this.i18n('i18n-m91z1o9b') /* 删除组件 */}
        >
          <Alert
            __component_name="Alert"
            message={
              <Space align="center" direction="horizontal" size={0}>
                <Row __component_name="Row" gutter={[0, 0]} wrap={true}>
                  <Col __component_name="Col" span={24}>
                    <Typography.Text
                      __component_name="Typography.Text"
                      disabled={false}
                      ellipsis={true}
                      strong={false}
                      style={{ fontSize: '' }}
                    >
                      {
                        this.i18n(
                          'i18n-x8jvcd94'
                        ) /* 删除组件即删除其所有版本信息，删除后将不在<组件市场>展示。确定删除组件 */
                      }
                    </Typography.Text>
                  </Col>
                  <Col __component_name="Col" span={24}>
                    <Space
                      __component_name="Space"
                      align="center"
                      direction="horizontal"
                      size="small"
                    >
                      <Typography.Text
                        __component_name="Typography.Text"
                        disabled={false}
                        ellipsis={{
                          rows: 1,
                          tooltip: {
                            _unsafe_MixedSetter_title_select: 'VariableSetter',
                            title: __$$eval(() => this.getName(this.state?.record)),
                          },
                        }}
                        strong={true}
                        style={{ fontSize: '', maxWidth: '400px' }}
                      >
                        {__$$eval(() => this.getName(this.state?.record))}
                      </Typography.Text>
                      <Typography.Text
                        __component_name="Typography.Text"
                        disabled={false}
                        ellipsis={true}
                        strong={false}
                        style={{ fontSize: '' }}
                      >
                        {this.i18n('i18n-ha9unjy9') /* 吗？ */}
                      </Typography.Text>
                    </Space>
                  </Col>
                </Row>
              </Space>
            }
            showIcon={true}
            type="info"
          />
        </Modal>
        <Modal
          __component_name="Modal"
          centered={false}
          className="componentPublishUpdateModal"
          confirmLoading={__$$eval(() => this.state.modalLoading)}
          destroyOnClose={true}
          forceRender={false}
          keyboard={true}
          mask={true}
          maskClosable={false}
          onCancel={function () {
            return this.closeModal.apply(this, Array.prototype.slice.call(arguments).concat([]));
          }.bind(this)}
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
        >
          <FormilyForm
            __component_name="FormilyForm"
            componentProps={{
              colon: false,
              labelAlign: 'left',
              labelCol: 5,
              layout: 'horizontal',
              wrapperCol: 20,
            }}
            formHelper={{ autoFocus: true }}
            ref={this._refsManager.linkRef('formily_create')}
          >
            <FormilySelect
              __component_name="FormilySelect"
              componentProps={{
                'x-component-props': {
                  _sdkSwrGetFunc: {},
                  allowClear: false,
                  disabled: __$$eval(() => this.state.modalType === 'update'),
                  placeholder: this.i18n('i18n-ydshspew') /* 请选择组件仓库 */,
                },
              }}
              decoratorProps={{ 'x-decorator-props': { labelEllipsis: false, tooltip: '' } }}
              fieldProps={{
                _unsafe_MixedSetter_enum_select: 'ExpressionSetter',
                _unsafe_MixedSetter_title_select: 'SlotSetter',
                description: '',
                enum: __$$eval(
                  () =>
                    this.props.useGetRepositoriesAll?.data?.repositoriesAll
                      ?.filter(item => item.repositoryType === 'chartmuseum')
                      ?.map(item => ({
                        value: item.name,
                        label: item.name,
                      })) || []
                ),
                name: 'repository',
                required: true,
                title: (
                  <Space align="center" direction="horizontal" size={3} style={{}}>
                    <Typography.Text
                      __component_name="Typography.Text"
                      disabled={false}
                      ellipsis={false}
                      strong={false}
                      style={{ fontSize: '' }}
                    >
                      {this.i18n('i18n-1po87kgw') /* 组件仓库 */}
                    </Typography.Text>
                    <Tooltip
                      __component_name="Tooltip"
                      title={
                        this.i18n(
                          'i18n-2izsqnki'
                        ) /* 现只支持手动发布组件到Chart Museum类型的组件仓库 */
                      }
                    >
                      <Container
                        __component_name="Container"
                        className="icon"
                        color="colorTextDescription"
                      >
                        <AntdIconQuestionCircleOutlined
                          __component_name="AntdIconQuestionCircleOutlined"
                          style={{ color: '' }}
                        />
                      </Container>
                    </Tooltip>
                  </Space>
                ),
                'x-validator': [],
              }}
            />
            <FormilyUpload
              __component_name="FormilyUpload"
              componentProps={{
                'x-component-props': {
                  accept: '.zip,.rar,.7z,.tar,.gz,.bz2,.tgz',
                  beforeUpload: function () {
                    return this.beforeUpload.apply(
                      this,
                      Array.prototype.slice.call(arguments).concat([])
                    );
                  }.bind(this),
                  maxCount: 1,
                  onChange: function () {
                    return this.handleFileChange.apply(
                      this,
                      Array.prototype.slice.call(arguments).concat([])
                    );
                  }.bind(this),
                },
              }}
              decoratorProps={{ 'x-decorator-props': { asterisk: true, labelEllipsis: true } }}
              fieldProps={{
                name: 'file',
                required: false,
                title: this.i18n('i18n-as2xi3jn') /* 组件helm包 */,
                'x-component': 'FormilyUpload',
                'x-validator': [
                  {
                    children: '未知',
                    id: 'disabled',
                    type: 'disabled',
                    validator: function () {
                      return this.validatorFile.apply(
                        this,
                        Array.prototype.slice.call(arguments).concat([])
                      );
                    }.bind(this),
                  },
                ],
              }}
            >
              {!!__$$eval(() => this.state.uploadVisible) && (
                <Row
                  __component_name="Row"
                  className="upload"
                  gutter={[0, 0]}
                  style={{
                    borderRadius: '4px',
                    cursor: 'pointer',
                    display: 'flex',
                    height: '180px',
                    margin: 'auto',
                    paddingTop: '56px',
                    width: '375px',
                  }}
                  wrap={true}
                >
                  <Col
                    __component_name="Col"
                    span={24}
                    style={{ display: 'flex', height: '30px', justifyContent: 'center' }}
                  >
                    <AntdIconPlusOutlined
                      __component_name="AntdIconPlusOutlined"
                      style={{ color: '#bbbbbb', fontSize: '16px', marginBottom: '-1px' }}
                    />
                  </Col>
                  <Col __component_name="Col" span={24}>
                    <Row __component_name="Row" gutter={[0, 8]} style={{}} wrap={true}>
                      <Col
                        __component_name="Col"
                        span={24}
                        style={{
                          alignItems: 'center',
                          display: 'flex',
                          justifyContent: 'center',
                          marginTop: '-40px',
                        }}
                      >
                        <Typography.Text
                          __component_name="Typography.Text"
                          disabled={false}
                          ellipsis={true}
                          strong={false}
                          style={{ fontSize: '' }}
                        >
                          {this.i18n('i18n-xsqa11zo') /* 点击或将 Helm 包拖拽到这里导入 */}
                        </Typography.Text>
                      </Col>
                      <Col
                        __component_name="Col"
                        span={24}
                        style={{
                          alignItems: 'center',
                          display: 'flex',
                          justifyContent: 'center',
                          marginTop: '-20px',
                        }}
                      >
                        {!!false && (
                          <Typography.Text
                            __component_name="Typography.Text"
                            disabled={false}
                            ellipsis={true}
                            strong={false}
                            style={{ fontSize: '' }}
                          >
                            {this.i18n('i18n-v8h9dmhm') /* 大小 1M 以内 */}
                          </Typography.Text>
                        )}
                      </Col>
                      <Col
                        __component_name="Col"
                        span={24}
                        style={{ alignItems: 'center', display: 'flex', justifyContent: 'center' }}
                      />
                    </Row>
                  </Col>
                </Row>
              )}
            </FormilyUpload>
          </FormilyForm>
        </Modal>
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
                  {this.i18n('i18n-u7cfx5g4') /* 我发布的 */}
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
                  options={__$$eval(() => this.state.clusters)}
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
                          href=""
                          icon={<AntdIconPlusOutlined __component_name="AntdIconPlusOutlined" />}
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
                          shape="default"
                          target="_self"
                          type="primary"
                        >
                          {this.i18n('i18n-4jc9ptx8') /* 组件发布 */}
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
                              style={{ textAlign: 'left', width: '90px' }}
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
                        {!!false && (
                          <Input.Search
                            __component_name="Input.Search"
                            onSearch={function () {
                              return this.handleSearchValueChange.apply(
                                this,
                                Array.prototype.slice.call(arguments).concat([])
                              );
                            }.bind(this)}
                            placeholder={this.i18n('i18n-8571905l') /*  请输入组件名称/组件仓库 */}
                            ref={this._refsManager.linkRef('input.search-28a8414d')}
                            style={{ width: '240px' }}
                          />
                        )}
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
                            () => this.props.useGetComponents?.data?.components?.totalCount || 0
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
                        render: (text, record, index) =>
                          (__$$context => (
                            <UnifiedLink
                              __component_name="UnifiedLink"
                              target="_self"
                              to={__$$eval(
                                () =>
                                  `/components/management/publish/management-detail/detail/${
                                    record?.name
                                  }?cluster=${__$$context.getCluster()}`
                              )}
                            >
                              {__$$eval(() => __$$context.getName(record))}
                            </UnifiedLink>
                          ))(__$$createChildContext(__$$context, { text, record, index })),
                        title: this.i18n('i18n-cuf6u4di') /* 组件名称 */,
                      },
                      {
                        dataIndex: 'version',
                        render: (text, record, index) =>
                          (__$$context => (
                            <Typography.Text
                              __component_name="Typography.Text"
                              disabled={false}
                              ellipsis={true}
                              strong={false}
                              style={{ fontSize: '' }}
                            >
                              {__$$eval(() => record?.latestVersion || '-')}
                            </Typography.Text>
                          ))(__$$createChildContext(__$$context, { text, record, index })),
                        title: this.i18n('i18n-vpbgp1lj') /* 最新版本 */,
                      },
                      {
                        dataIndex: 'repository',
                        key: 'chartName',
                        title: this.i18n('i18n-1po87kgw') /* 组件仓库 */,
                      },
                      {
                        dataIndex: 'status',
                        key: 'status',
                        render: (text, record, index) =>
                          (__$$context => (
                            <Status
                              __component_name="Status"
                              id={__$$eval(() => record?.status)}
                              types={__$$eval(() =>
                                __$$context.utils.getComponentPublishStatus(__$$context, true)
                              )}
                            />
                          ))(__$$createChildContext(__$$context, { text, record, index })),
                        title: this.i18n('i18n-o48ciymn') /* 当前状态 */,
                      },
                      {
                        dataIndex: 'updatedAt',
                        key: 'updatetime',
                        render: (text, record, index) =>
                          (__$$context => (
                            <Typography.Time
                              __component_name="Typography.Time"
                              format=""
                              relativeTime={false}
                              time={__$$eval(() => record.updatedAt)}
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
                              <Button
                                __component_name="Button"
                                block={false}
                                danger={false}
                                disabled={false}
                                ghost={false}
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
                                shape="default"
                              >
                                {this.i18n('i18n-8ign6rmf') /* 更新 */}
                              </Button>
                              <Button
                                __component_name="Button"
                                block={false}
                                danger={false}
                                disabled={false}
                                ghost={false}
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
                      () => this.props.useGetComponents?.data?.components?.nodes || []
                    )}
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
                    pagination={false}
                    rowKey="name"
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
  const match = matchPath({ path: '/components/management/publish' }, location.pathname);
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
        <ComponentsManagementPublish$$Page
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
