// 注意: 出码引擎注入的临时变量默认都以 "__$$" 开头，禁止在搭建的代码中直接访问。
// 例外：react 框架的导出名和各种组件名除外。
import React from 'react';

import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Descriptions,
  Divider,
  Dropdown,
  Empty,
  FormilyForm,
  FormilyFormItem,
  FormilyInput,
  FormilySelect,
  Image,
  Modal,
  Page,
  Rate,
  Row,
  Space,
  Spin,
  Status,
  Table,
  Tabs,
  Tag,
  Tooltip,
  Typography,
  UnifiedLink,
} from '@tenx-ui/materials';

import {
  AntdIconDownloadOutlined,
  AntdIconDownOutlined,
  AntdIconHomeOutlined,
  TenxIconKubebbKeywords,
  TenxIconKubebbVersion,
  TenxIconTips,
} from '@tenx-ui/icon-materials';

import TenxUiReactMarkdownLowcodeMaterials from '@tenx-ui/react-markdown-lowcode-materials';

import { getUnifiedHistory } from '@tenx-ui/utils/es/UnifiedLink/index.prod';
import { matchPath, useLocation } from '@umijs/max';
import qs from 'query-string';
import { DataProvider } from 'shared-components';

import utils, { RefsManager } from '../../utils/__utils';

import * as __$$i18n from '../../i18n';

import __$$constants from '../../__constants';

import './index.css';

class ComponentsDetail$$Page extends React.Component {
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
      getRatingLoading: false,
      isOpenModal: false,
      modalLoading: false,
      modalType: 'delete',
      rateEnabled: false,
      rateInstall: false,
      ratePermission: false,
      rateResult: undefined,
      rateStatus: undefined,
      rateTimer: undefined,
      readme: undefined,
      readmeLoading: false,
      tab: 'info',
      tenants: [],
      version: undefined,
    };
  }

  $ = refName => {
    return this._refsManager.get(refName);
  };

  $$ = refName => {
    return this._refsManager.getAll(refName);
  };

  componentWillUnmount() {
    if (this.state.rateTimer) {
      clearTimeout(this.state.rateTimer);
    }
    if (this.state.timer) {
      clearTimeout(this.state.timer);
    }
  }

  closeModal() {
    this.setState({
      isOpenModal: false,
    });
  }

  async confirmDeleteModal(e, payload) {
    const data = this.props.useGetComponent?.data?.component;
    this.setState({
      modalLoading: true,
    });
    try {
      await this.utils.bff.deleteComponent({
        chart: {
          chartName: data?.chartName,
          repository: data?.repository,
          versions: [this.getVersionInfo()?.version],
        },
        cluster: data?.cluster || this.getCluster(),
      });
      this.closeModal();
      this.utils.notification.success({
        message: this.i18n('i18n-6fr7wu19'),
      });
      this.setState({
        modalLoading: false,
      });
      if (data?.versions?.length < 2) {
        this.history.go(-1);
        return;
      }
      this.props.useGetComponent.mutate();
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

  async confirmSubscriptionModal(e, payload) {
    const form = this.form();
    form.submit(async v => {
      const data = this.props.useGetComponent?.data?.component;
      this.setState({
        modalLoading: true,
      });
      try {
        await this.utils.bff.createSubscription({
          subscription: {
            name: data?.name,
            namespace: v?.info?.namespace,
          },
          cluster: data?.cluster || this.getCluster(),
        });
        this.closeModal();
        this.utils.notification.success({
          message: this.i18n('i18n-vrfy9kmq'),
        });
        this.history.go(-1);
        this.setState({
          modalLoading: false,
        });
      } catch (error) {
        this.setState({
          modalLoading: false,
        });
        this.utils.notification.warnings({
          message: this.i18n('i18n-byab1606'),
          errors: error?.response?.errors,
        });
      }
    });
  }

  async createRating() {
    this.setState({
      rateStatus: 'progress',
    });
    try {
      await this.utils.bff.createRating({
        createRatingsInput: {
          version: this.getVersionInfo()?.version,
          componentName: this.appHelper?.match?.params?.id,
          namespace: undefined,
          url: this.getVersionInfo()?.urls?.[0],
        },
        cluster: this.getCluster(),
      });
      this.closeModal();
      this.utils.notification.success({
        message: this.i18n('i18n-8u8kdjrn'),
      });
      this.setState({
        modalLoading: false,
      });
      setTimeout(() => {
        this.getRating();
      }, 1000);
    } catch (error) {
      this.setState({
        modalLoading: false,
      });
      this.utils.notification.warnings({
        message: this.i18n('i18n-bvjt8okb'),
        errors: error?.response?.errors,
      });
    }
  }

  exportSVGToPng(svgId, pngFileName) {
    const svgElement = document.getElementById(svgId);
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const viewBoxWidth = parseFloat(svgElement.viewBox.animVal?.width);
    const viewBoxHeight = parseFloat(svgElement.viewBox.animVal?.height);
    canvas.width = viewBoxWidth * 1.5;
    canvas.height = viewBoxHeight * 1.5;
    const image = new Image();
    image.src =
      'data:image/svg+xml,' + encodeURIComponent(new XMLSerializer().serializeToString(svgElement));
    image.onload = function () {
      context.drawImage(image, 0, 0);
      const link = document.createElement('a');
      link.href = canvas.toDataURL();
      link.download = pngFileName || 'exported_image.png';
      link.click();
      document.getElementById('vizSvgContainer').innerHTML = '';
    };
  }

  form(name) {
    return this.$(name || 'formily_subscription')?.formRef?.current?.form;
  }

  getCluster() {
    const cluster = this.appHelper?.history?.query?.cluster;
    return cluster;
  }

  getClusterInfo() {
    return this.state.cluster;
  }

  getContainer() {
    return window;
  }

  getCurrentAnchor(activeLink) {
    return activeLink || '#description';
  }

  getName(item) {
    item = item || {};
    if (item.displayName) {
      return `${item.displayName}(${item.chartName || '-'})`;
    }
    return item.chartName || '-';
  }

  async getRateEnabled() {
    const { repository } = this.props.useGetComponent?.data?.component || {};
    if (!repository) {
      setTimeout(() => {
        this.getRateEnabled();
      }, 200);
      return;
    }
    try {
      const res = await this.utils.bff.getRepository({
        name: repository,
        cluster: this.getCluster(),
      });
      this.setState({
        rateEnabled: res?.repository?.enableRating,
      });
    } catch (error) {}
  }

  async getRateInstall() {
    try {
      const res = await this.utils.bff.getRatingDeploymentStatus({
        namespace: undefined,
        cluster: this.getCluster(),
      });
      this.setState({
        rateInstall: !!res?.ratingDeploymentStatus,
      });
    } catch (error) {
      this.setState({
        rateInstall: true,
      });
    }
  }

  getRateModalName() {
    return `${this.getName(this.props.useGetComponent?.data?.component)}(${
      this.getVersionInfo()?.version || '-'
    })`;
  }

  async getRatePermission() {
    try {
      const res = await this.utils.bffSdk.userAuthCanI({
        cluster: this.getCluster(),
        resource: {
          verb: 'create',
          group: 'core.kubebb.k8s.com.cn',
          resource: 'ratings',
        },
      });
      this.setState({
        ratePermission: !!res?.userAuthCanI,
      });
    } catch (error) {}
  }

  getRateType(type) {
    if (type === 'security') {
      return this.i18n('i18n-65frxbeg');
    }
    if (type === 'reliability') {
      return this.i18n('i18n-g7eu2ue1');
    }
    return this.i18n('i18n-lr4x7c49');
  }

  async getRating() {
    this.setState({
      getRatingLoading: true,
    });
    try {
      const preRes = await this.utils.bff.getRating({
        componentName: this.appHelper?.match?.params?.id,
        namespace: undefined,
        // name: 'rating-6s283',
        version: this.getVersionInfo()?.version,
        cluster: this.getCluster(),
        isLatestSuccessed: true,
        // repository: String
      });

      const res = await this.utils.bff.getRating({
        componentName: this.appHelper?.match?.params?.id,
        namespace: undefined,
        // name: 'rating-6s283',
        version: this.getVersionInfo()?.version,
        cluster: this.getCluster(),
        isLatestSuccessed: false,
        // repository: String
      });

      const getStatus = () => {
        if (['EvaluationSucceeded'].includes(res?.rating?.status)) {
          return 'success';
        }
        if (['PipelineRunning', 'Created'].includes(res?.rating?.status)) {
          if (this.state.rateTimer) {
            clearTimeout(this.state.rateTimer);
          }
          this.setState({
            rateTimer: setTimeout(() => {
              this.getRating();
            }, 1000 * 10),
          });
          return 'progress';
        }
        if (!res?.rating) {
          return undefined;
        }
        return 'failed';
      };
      this.setState({
        getRatingLoading: false,
        rateStatus: getStatus(),
        rateResult: getStatus() === 'success' ? res?.rating : preRes?.rating,
      });
    } catch (error) {
      this.setState({
        getRatingLoading: false,
        rateStatus: 'failed',
        rateResult: undefined,
      });
    }
  }

  async getReademe() {
    this.setState({
      readmeLoading: true,
    });
    const res = await this.utils.bff.getComponentChartReadme({
      name: this.appHelper?.match?.params?.id,
      version: this.getVersionInfo()?.version,
    });
    this.setState({
      readme: res?.component?.chart?.readme,
      readmeLoading: false,
    });
  }

  getVersionInfo() {
    return (
      this.props.useGetComponent?.data?.component?.versions.find(item => {
        return item.version === this.state.version;
      }) || this.props.useGetComponent?.data?.component?.versions?.[0]
    );
  }

  handleDownloadRBAC(_, { record }) {
    const dot = record.rbac;
    // 'digraph { a -> b }'
    const name = record?.pipelinerun + '.png';
    this.utils.vizInstance().then(viz => {
      const svg = viz.renderSVGElement(dot);
      svg.setAttribute('id', 'vizSvg');
      document.getElementById('vizSvgContainer').appendChild(svg);
      this.exportSVGToPng('vizSvg', name);
    });
  }

  handleOprationBtnClick(e) {
    const pre = this.appHelper?.location?.pathname?.split('/')?.slice(0, 4)?.join('/');
    this.history.push(
      `${pre}/management-action/install/${
        this.props.useGetComponent?.data?.component?.name
      }?cluster=${this.getCluster()}`
    );
  }

  async handleOprationMenuClick(e) {
    if (e?.key === 'subscription') {
      this.setState(
        {
          isOpenModal: true,
          modalType: 'subscription',
        },
        () => {
          const { chartName } = this.props.useGetComponent?.data?.component || {};
          this.setFormValues({
            chartName,
            version: this.getVersionInfo()?.version,
          });
        }
      );
    }
    if (e?.key === 'download') {
      const { chartName, repository } = this.props.useGetComponent?.data?.component || {};
      const res = await this.utils.bff.downloadComponent({
        cluster: this.getCluster(),
        chart: {
          chartName,
          repository,
          version: this.getVersionInfo()?.version,
        },
      });
      const url = res?.componentDownload;
      window.open(url);
    }
  }

  handleRefresh() {
    this.props.useGetComponent.mutate();
  }

  handleTabChange(v) {
    this.setState({
      tab: v,
    });
    if (v === 'READEME') {
      this.getReademe();
    }
    if (v === 'rate') {
      this.getRating();
    }
  }

  handleVersionMenuClick(e) {
    this.setState(
      {
        version: e.key,
      },
      () => {
        this.getReademe();
        this.getRating();
      }
    );
  }

  initTab() {
    const version = this.getVersionInfo()?.version;
    const tab = this.appHelper?.history?.query?.tab;
    this.setState({
      tab: tab || 'info',
    });
    if (!version) {
      setTimeout(() => {
        this.initTab();
      }, 300);
      return;
    }
    tab && this.handleTabChange(tab);
  }

  async loadCluster() {
    const res = await this.props.appHelper?.utils?.bffSdk?.getCluster({
      name: this.getCluster(),
    });
    const cluster = res?.cluster;
    this.setState({
      cluster,
    });
  }

  async loadTenants() {
    const res = await this.props.appHelper?.utils?.bffSdk?.getCurrentUserTenants();
    const tenants =
      res?.userCurrent?.tenants?.map(item => {
        item.projects =
          item.projects
            ?.filter(item => {
              return item.clusters?.some(cluster => cluster.name === this.getCluster());
            })
            ?.map(item => ({
              label: item.fullName,
              value: item.name,
            })) || [];
        return {
          label: item.fullName,
          value: JSON.stringify(item),
        };
      }) || [];
    this.setState({
      tenants,
    });
  }

  openDeleteModal() {
    this.setState({
      isOpenModal: true,
    });
  }

  openRateModal() {
    this.setState({
      isOpenModal: true,
      modalType: 'rate',
    });
  }

  setFormValues(values, name) {
    if (!this.form(name)) {
      if (this.state.timer) {
        clearTimeout(this.state.timer);
      }
      this.setState({
        timer: setTimeout(() => this.setFormValues(values, name), 200),
      });
      return;
    }
    this.form(name).setValues(values);
  }

  async validatorInstall(value) {
    try {
      if (value) {
        const res = await this.props?.appHelper?.utils?.bff?.getSubscriptions({
          namespace: value,
          cluster: this.getCluster(),
        });
        const name = this.props.useGetComponent?.data?.component?.name;
        if (
          res?.subscriptions?.some(
            item => item.component?.name === name && item?.releaseName === name
          )
        ) {
          return this.i18n('i18n-k6pq1phn');
        }
      }
    } catch (e) {}
  }

  componentDidMount() {
    this.loadCluster();
    this.loadTenants();
    this.initTab();
    this.getRatePermission();
    this.getRateEnabled();
    this.getRateInstall();
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
            return this.createRating.apply(this, Array.prototype.slice.call(arguments).concat([]));
          }.bind(this)}
          open={__$$eval(() => this.state.isOpenModal && this.state.modalType === 'rate')}
          title={this.i18n('i18n-99fynr0e') /* 发起评测 */}
        >
          <Typography.Text
            __component_name="Typography.Text"
            disabled={false}
            ellipsis={true}
            strong={false}
            style={{ fontSize: '' }}
          >
            {this.i18n('i18n-1n7ps4dd') /* 确定为 */}
          </Typography.Text>
          <Typography.Text
            __component_name="Typography.Text"
            disabled={false}
            ellipsis={true}
            strong={true}
            style={{ fontSize: '', paddingLeft: '4px', paddingRight: '4px' }}
          >
            {__$$eval(() => this.getRateModalName())}
          </Typography.Text>
          <Typography.Text
            __component_name="Typography.Text"
            disabled={false}
            ellipsis={true}
            strong={false}
            style={{ fontSize: '' }}
          >
            {this.i18n('i18n-zonf0aon') /* 发起评测吗？ */}
          </Typography.Text>
        </Modal>
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
            return this.confirmSubscriptionModal.apply(
              this,
              Array.prototype.slice.call(arguments).concat([])
            );
          }.bind(this)}
          open={__$$eval(() => this.state.isOpenModal && this.state.modalType === 'subscription')}
          title={this.i18n('i18n-h8k0fzco') /* 订阅组件 */}
        >
          <FormilyForm
            __component_name="FormilyForm"
            componentProps={{
              colon: false,
              labelAlign: 'left',
              labelCol: 4,
              layout: 'horizontal',
              wrapperCol: 20,
            }}
            ref={this._refsManager.linkRef('formily_subscription')}
          >
            <FormilyInput
              __component_name="FormilyInput"
              componentProps={{
                'x-component-props': { placeholder: this.i18n('i18n-n9a8du2a') /* 请输入 */ },
              }}
              fieldProps={{
                name: 'chartName',
                required: true,
                title: this.i18n('i18n-cuf6u4di') /* 组件名称 */,
                'x-pattern': 'disabled',
                'x-validator': [],
              }}
            />
            {!!false && (
              <FormilyInput
                __component_name="FormilyInput"
                componentProps={{
                  'x-component-props': { placeholder: this.i18n('i18n-n9a8du2a') /* 请输入 */ },
                }}
                fieldProps={{
                  name: 'version',
                  required: true,
                  title: this.i18n('i18n-ekp8efeq') /* 组件版本 */,
                  'x-pattern': 'disabled',
                  'x-validator': [],
                }}
              />
            )}
            <FormilyFormItem
              __component_name="FormilyFormItem"
              componentProps={{ 'x-component-props': {} }}
              decoratorProps={{ 'x-decorator-props': { asterisk: true } }}
              fieldProps={{
                name: 'info',
                title: this.i18n('i18n-tchopvzq') /* 订阅项目 */,
                'x-component': 'FormilyFormItem',
                'x-validator': [],
              }}
            >
              <Space __component_name="Space" align="center" direction="horizontal">
                <FormilySelect
                  __component_name="FormilySelect"
                  componentProps={{
                    'x-component-props': {
                      _sdkSwrGetFunc: {},
                      allowClear: false,
                      disabled: false,
                      placeholder: this.i18n('i18n-lhvq14lg') /* 请选择租户 */,
                    },
                  }}
                  fieldProps={{
                    _unsafe_MixedSetter_enum_select: 'ExpressionSetter',
                    enum: __$$eval(() => this.state.tenants || []),
                    name: 'tenant',
                    title: '',
                    'x-validator': [],
                  }}
                  style={{ width: '191px' }}
                />
                <FormilySelect
                  __component_name="FormilySelect"
                  componentProps={{
                    'x-component-props': {
                      _sdkSwrGetFunc: {},
                      _unsafe_MixedSetter__sdkSwrGetFunc_select: 'ObjectSetter',
                      allowClear: false,
                      disabled: false,
                      placeholder: this.i18n('i18n-er0hhc9i') /* 请选择项目 */,
                    },
                  }}
                  fieldProps={{
                    _unsafe_MixedSetter_enum_select: 'ArraySetter',
                    enum: '{{(() => {return $form?.values?.info?.tenant ? JSON.parse($form?.values?.info?.tenant)?.projects : []})()}}',
                    name: 'namespace',
                    title: '',
                    'x-validator': [
                      {
                        children: '未知',
                        id: 'disabled',
                        triggerType: 'onBlur',
                        type: 'disabled',
                        validator: function () {
                          return this.validatorInstall.apply(
                            this,
                            Array.prototype.slice.call(arguments).concat([])
                          );
                        }.bind(this),
                      },
                    ],
                  }}
                  style={{ width: '190px' }}
                />
              </Space>
            </FormilyFormItem>
          </FormilyForm>
        </Modal>
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
          title={this.i18n('i18n-p9k8gbed') /* 删除组件版本 */}
        >
          <Alert
            __component_name="Alert"
            message={[
              !!__$$eval(
                () => this.props.useGetComponent?.data?.component?.versions?.length > 1
              ) && (
                <Space
                  __component_name="Space"
                  align="center"
                  direction="horizontal"
                  key="node_ocllukbnzp6"
                >
                  <Typography.Text
                    __component_name="Typography.Text"
                    disabled={false}
                    ellipsis={true}
                    strong={false}
                    style={{ fontSize: '' }}
                  >
                    {this.i18n('i18n-2kvb9vmj') /* 确定删除当前组件的 */}
                  </Typography.Text>
                  <Typography.Text
                    __component_name="Typography.Text"
                    disabled={false}
                    ellipsis={true}
                    strong={false}
                    style={{ fontSize: '' }}
                  >
                    {__$$eval(() => this.getVersionInfo()?.version || '-')}
                  </Typography.Text>
                  <Typography.Text
                    __component_name="Typography.Text"
                    disabled={false}
                    ellipsis={true}
                    strong={false}
                    style={{ fontSize: '' }}
                  >
                    {this.i18n('i18n-fcs6dou2') /* 版本吗？ */}
                  </Typography.Text>
                </Space>
              ),
              !!__$$eval(
                () => this.props.useGetComponent?.data?.component?.versions?.length < 2
              ) && (
                <Space
                  __component_name="Space"
                  align="center"
                  direction="horizontal"
                  key="node_ocllukbnzp1"
                >
                  <Typography.Text
                    __component_name="Typography.Text"
                    disabled={false}
                    ellipsis={true}
                    strong={false}
                    style={{ fontSize: '' }}
                  >
                    {
                      this.i18n(
                        'i18n-olrdlypz'
                      ) /* 当前组件仅有一个版本，删除后，将不在<组件市场>展示。 */
                    }
                  </Typography.Text>
                </Space>
              ),
              !!__$$eval(
                () => this.props.useGetComponent?.data?.component?.versions?.length < 2
              ) && (
                <Space
                  __component_name="Space"
                  align="center"
                  direction="horizontal"
                  key="node_ocllukbnzpa"
                >
                  <Typography.Text
                    __component_name="Typography.Text"
                    disabled={false}
                    ellipsis={true}
                    strong={false}
                    style={{ fontSize: '' }}
                  >
                    {this.i18n('i18n-l5mx5mvn') /* 确定删除版本 */}
                  </Typography.Text>
                  <Typography.Text
                    __component_name="Typography.Text"
                    disabled={false}
                    ellipsis={true}
                    strong={false}
                    style={{ fontSize: '' }}
                  >
                    {__$$eval(() => this.getVersionInfo()?.version || '-')}
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
              ),
            ]}
            showIcon={true}
            type="info"
          />
        </Modal>
        <Container __component_name="Container" id="vizSvgContainer" style={{ display: 'none' }} />
        <Row __component_name="Row" wrap={true}>
          <Col __component_name="Col" span={24}>
            <Space align="center" direction="horizontal">
              <Button.Back
                __component_name="Button.Back"
                name={this.i18n('i18n-86so9ago') /* 返回 */}
                path="/components/market"
                title={this.i18n('i18n-00cyzhs8') /* 组件详情 */}
                type="primary"
              />
            </Space>
            <Tag
              __component_name="Tag"
              closable={false}
              color="rgba(0,0,0,0.65)"
              style={{
                borderBottomLeftRadius: '2px',
                borderRadius: '0',
                borderTopLeftRadius: '2px',
                marginLeft: '16px',
                marginRight: '0px',
                marginTop: '-5px',
                position: 'relative',
              }}
            >
              {this.i18n('i18n-yfkq2xqq') /* 集群 */}
            </Tag>
            <Tag
              __component_name="Tag"
              closable={false}
              color="#ffffff"
              style={{
                background: 'white',
                borderBottomRightRadius: '2px',
                borderRadius: '0',
                borderTopRightRadius: '2px',
                color: 'rgba(0,0,0,0.85)',
                marginTop: '-5px',
                position: 'relative',
              }}
            >
              {__$$eval(() => this.getClusterInfo()?.fullName || '-')}
            </Tag>
          </Col>
          <Col __component_name="Col" span={24}>
            <Card
              __component_name="Card"
              actions={[]}
              bordered={false}
              hoverable={false}
              loading={false}
              size="default"
              type="inner"
            >
              <Row __component_name="Row" wrap={false}>
                <Col
                  __component_name="Col"
                  flex="80px"
                  style={{ alignItems: 'center', display: 'flex' }}
                >
                  <Image
                    __component_name="Image"
                    fallback=""
                    height={40}
                    preview={false}
                    src={__$$eval(
                      () =>
                        this.props.useGetComponent?.data?.component?.icon ||
                        'data:image/png;base64,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'
                    )}
                    width={40}
                  />
                </Col>
                <Col __component_name="Col" flex="auto">
                  <Row __component_name="Row" wrap={false}>
                    <Col __component_name="Col" flex="auto">
                      <Row __component_name="Row" gutter={[0, 0]} wrap={true}>
                        <Col __component_name="Col" span={24}>
                          <Row __component_name="Row" style={{ paddingTop: '4px' }} wrap={false}>
                            <Col
                              __component_name="Col"
                              flex=""
                              style={{ maxWidth: 'calc(100% - 100px)' }}
                            >
                              <Typography.Text
                                __component_name="Typography.Text"
                                disabled={false}
                                ellipsis={true}
                                strong={true}
                                style={{ fontSize: '18px' }}
                              >
                                {__$$eval(() =>
                                  this.getName(this.props.useGetComponent?.data?.component)
                                )}
                              </Typography.Text>
                            </Col>
                            <Col __component_name="Col" flex="auto">
                              {!!__$$eval(
                                () => this.props.useGetComponent?.data?.component?.isNewer
                              ) && (
                                <Tag __component_name="Tag" closable={false} color="success">
                                  NEW
                                </Tag>
                              )}
                              {!!false && (
                                <Tag
                                  __component_name="Tag"
                                  closable={false}
                                  color={__$$eval(
                                    () =>
                                      this.utils
                                        .getComponentTypes(this, false, true)
                                        ?.find(item => item.value === 'ky')?.color || 'default'
                                  )}
                                >
                                  {__$$eval(
                                    () =>
                                      this.utils
                                        .getComponentTypes(this, false, true)
                                        ?.find(item => item.value === 'ky')?.children || '-'
                                  )}
                                </Tag>
                              )}
                            </Col>
                          </Row>
                        </Col>
                        <Col __component_name="Col" span={24}>
                          <Space align="center" direction="horizontal" style={{ display: 'flex' }}>
                            <Tooltip
                              __component_name="Tooltip"
                              title={this.i18n('i18n-7e7t3bw9') /* 版本 */}
                            >
                              <Container
                                __component_name="Container"
                                color="colorTextDescription"
                                style={{ display: 'inline' }}
                              >
                                <TenxIconKubebbVersion
                                  __component_name="TenxIconKubebbVersion"
                                  color=""
                                  style={{ position: 'relative', top: '1px' }}
                                />
                              </Container>
                              <Dropdown
                                __component_name="Dropdown"
                                destroyPopupOnHide={true}
                                disabled={false}
                                menu={{
                                  items: __$$eval(
                                    () =>
                                      this.props.useGetComponent?.data?.component?.versions?.map(
                                        item => ({
                                          key: item.version,
                                          label: item.version,
                                        })
                                      ) || []
                                  ),
                                  onClick: function () {
                                    return this.handleVersionMenuClick.apply(
                                      this,
                                      Array.prototype.slice.call(arguments).concat([])
                                    );
                                  }.bind(this),
                                }}
                                overlayStyle={__$$eval(() => ({
                                  width: '100px',
                                  overflow: 'auto',
                                  maxHeight: '200px',
                                  boxShadow:
                                    '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)',
                                }))}
                                placement="bottomLeft"
                                style={{}}
                                trigger={['hover']}
                              >
                                <Button
                                  __component_name="Button"
                                  block={false}
                                  danger={false}
                                  disabled={false}
                                  ghost={false}
                                  shape="default"
                                  style={{
                                    paddingBottom: '0px',
                                    paddingLeft: '8px',
                                    paddingRight: '0px',
                                    paddingTop: '0px',
                                  }}
                                  type="link"
                                >
                                  {[
                                    <Typography.Text
                                      __component_name="Typography.Text"
                                      disabled={false}
                                      strong={false}
                                      style={{ color: 'inherit', fontSize: '' }}
                                      key="node_oclkm7vpnx4s"
                                    >
                                      {__$$eval(() => this.getVersionInfo()?.version || '-')}
                                    </Typography.Text>,
                                    <AntdIconDownOutlined
                                      __component_name="AntdIconDownOutlined"
                                      style={{ fontSize: '10px', marginLeft: '12px' }}
                                      key="node_oclkm7vpnx4t"
                                    />,
                                  ]}
                                </Button>
                                <Divider
                                  __component_name="Divider"
                                  content={[null]}
                                  dashed={true}
                                  defaultOpen={true}
                                  mode="expanded"
                                  orientation="left"
                                  orientationMargin={0}
                                >
                                  高级配置
                                </Divider>
                                <Divider
                                  __component_name="Divider"
                                  dashed={false}
                                  defaultOpen={false}
                                  mode="line"
                                />
                                <Divider
                                  __component_name="Divider"
                                  dashed={false}
                                  defaultOpen={false}
                                  mode="line"
                                />
                              </Dropdown>
                            </Tooltip>
                            <Divider
                              __component_name="Divider"
                              dashed={false}
                              defaultOpen={false}
                              mode="default"
                              type="vertical"
                            />
                            <Tooltip
                              __component_name="Tooltip"
                              title={this.i18n('i18n-1po87kgw') /* 组件仓库 */}
                            >
                              <Container __component_name="Container" color="colorTextDescription">
                                <AntdIconHomeOutlined
                                  __component_name="AntdIconHomeOutlined"
                                  style={{ color: '', position: 'relative', top: '3px' }}
                                />
                              </Container>
                            </Tooltip>
                            <Typography.Text
                              __component_name="Typography.Text"
                              disabled={false}
                              ellipsis={false}
                              strong={false}
                              style={{ fontSize: '' }}
                            >
                              {__$$eval(
                                () => this.props.useGetComponent?.data?.component?.repository || '-'
                              )}
                            </Typography.Text>
                            <Divider
                              __component_name="Divider"
                              dashed={false}
                              defaultOpen={false}
                              mode="default"
                              type="vertical"
                            />
                            <Tooltip
                              __component_name="Tooltip"
                              title={this.i18n('i18n-02hvitqg') /* 关键字 */}
                            >
                              <Container __component_name="Container" color="colorTextDescription">
                                <TenxIconKubebbKeywords
                                  __component_name="TenxIconKubebbKeywords"
                                  color=""
                                  size={14}
                                  style={{ position: 'relative', top: '4px' }}
                                />
                              </Container>
                            </Tooltip>
                            <Typography.Text
                              __component_name="Typography.Text"
                              disabled={false}
                              ellipsis={true}
                              strong={false}
                              style={{ fontSize: '' }}
                            >
                              {__$$eval(
                                () =>
                                  this.props.useGetComponent?.data?.component?.keywords?.join(
                                    '，'
                                  ) || '-'
                              )}
                            </Typography.Text>
                          </Space>
                        </Col>
                      </Row>
                    </Col>
                    <Col
                      __component_name="Col"
                      flex={__$$eval(() =>
                        this.props.appHelper?.match?.pathname?.startsWith(
                          '/components/management/publish'
                        )
                          ? '160px'
                          : '102px'
                      )}
                      style={{ alignItems: 'center', display: 'flex' }}
                    >
                      <Space __component_name="Space" align="center" direction="horizontal">
                        {!!__$$eval(
                          () =>
                            !this.props.appHelper?.match?.pathname?.startsWith('/components/market')
                        ) && (
                          <Button
                            __component_name="Button"
                            block={false}
                            danger={false}
                            disabled={false}
                            ghost={false}
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
                        )}
                        {!!__$$eval(() =>
                          this.props.appHelper?.match?.pathname?.startsWith(
                            '/components/management/publish'
                          )
                        ) && (
                          <Button
                            __component_name="Button"
                            block={false}
                            danger={true}
                            disabled={false}
                            ghost={false}
                            onClick={function () {
                              return this.openDeleteModal.apply(
                                this,
                                Array.prototype.slice.call(arguments).concat([])
                              );
                            }.bind(this)}
                            shape="default"
                            type="default"
                          >
                            {this.i18n('i18n-l5zu1evc') /* 删除版本 */}
                          </Button>
                        )}
                      </Space>
                      {!!__$$eval(() =>
                        this.props.appHelper?.match?.pathname?.startsWith('/components/market')
                      ) && (
                        <Dropdown.Button
                          __component_name="Dropdown.Button"
                          danger={false}
                          destroyPopupOnHide={true}
                          disabled={false}
                          menu={{
                            items: [
                              { key: 'subscription', label: this.i18n('i18n-hvqmrs0i') /* 订阅 */ },
                              { key: 'download', label: this.i18n('i18n-yhe02js8') /* 下载 */ },
                            ],
                            onClick: function () {
                              return this.handleOprationMenuClick.apply(
                                this,
                                Array.prototype.slice.call(arguments).concat([])
                              );
                            }.bind(this),
                          }}
                          onClick={function () {
                            return this.handleOprationBtnClick.apply(
                              this,
                              Array.prototype.slice.call(arguments).concat([])
                            );
                          }.bind(this)}
                          overlayStyle={{ width: '100px' }}
                          placement="bottomRight"
                          style={{}}
                          trigger={['hover']}
                          type="default"
                        >
                          {this.i18n('i18n-s827y1s8') /* 安装 */}
                        </Dropdown.Button>
                      )}
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Card>
          </Col>
          <Col __component_name="Col" span={23}>
            <Card
              __component_name="Card"
              actions={[]}
              bordered={false}
              hoverable={false}
              loading={__$$eval(
                () =>
                  this.props.useGetComponent?.isLoading ||
                  this.props?.useGetComponent?.loading ||
                  false
              )}
              size="default"
              type="inner"
            >
              <Tabs
                __component_name="Tabs"
                activeKey={__$$eval(() => this.state.tab)}
                destroyInactiveTabPane="true"
                items={[
                  {
                    children: (
                      <Row __component_name="Row" gutter={[0, 0]} wrap={true}>
                        <Col __component_name="Col" span={24}>
                          <Descriptions
                            __component_name="Descriptions"
                            bordered={false}
                            borderedBottom={false}
                            borderedBottomDashed={false}
                            colon={false}
                            column={1}
                            id="description"
                            items={[
                              {
                                children: (
                                  <Typography.Text
                                    __component_name="Typography.Text"
                                    disabled={false}
                                    ellipsis={true}
                                    strong={false}
                                    style={{ fontSize: '' }}
                                  >
                                    {__$$eval(
                                      () =>
                                        this.props.useGetComponent?.data?.component?.description ||
                                        '-'
                                    )}
                                  </Typography.Text>
                                ),
                                key: 'pi5m3iilqxj',
                                label: this.i18n('i18n-fm60ewc6') /* 组件描述 */,
                                span: 1,
                              },
                              {
                                children: (
                                  <Typography.Time
                                    __component_name="Typography.Time"
                                    format=""
                                    relativeTime={false}
                                    time={__$$eval(
                                      () =>
                                        this.props.useGetComponent?.data?.component
                                          ?.creationTimestamp
                                    )}
                                  />
                                ),
                                key: 'et5s0offl7d',
                                label: this.i18n('i18n-wuup4l9q') /* 组件创建时间 */,
                                span: 1,
                              },
                              {
                                children: (
                                  <Typography.Time
                                    __component_name="Typography.Time"
                                    format=""
                                    relativeTime={false}
                                    time={__$$eval(
                                      () => this.props.useGetComponent?.data?.component?.updatedAt
                                    )}
                                  />
                                ),
                                key: '672hupxnu9c',
                                label: this.i18n('i18n-j1vviznx') /* 组件更新时间 */,
                                span: 1,
                              },
                              {
                                children: (
                                  <UnifiedLink
                                    __component_name="UnifiedLink"
                                    target="_blank"
                                    to={__$$eval(
                                      () => this.props.useGetComponent?.data?.component?.home || '-'
                                    )}
                                  >
                                    {__$$eval(
                                      () => this.props.useGetComponent?.data?.component?.home || '-'
                                    )}
                                  </UnifiedLink>
                                ),
                                key: 'apettitpge7',
                                label: this.i18n('i18n-f34yu3md') /* 组件官网 */,
                                span: 1,
                              },
                              {
                                children: (
                                  <Row __component_name="Row" gutter={[0, 0]} wrap={true}>
                                    {__$$evalArray(
                                      () =>
                                        this.props.useGetComponent?.data?.component?.sources || []
                                    ).map((item, index) =>
                                      (__$$context => (
                                        <Col __component_name="Col" span={24}>
                                          <UnifiedLink
                                            __component_name="UnifiedLink"
                                            target="_blank"
                                            to={__$$eval(() => item)}
                                          >
                                            {__$$eval(() => item || '-')}
                                          </UnifiedLink>
                                        </Col>
                                      ))(__$$createChildContext(__$$context, { item, index }))
                                    )}
                                  </Row>
                                ),
                                key: '636ln138sl7',
                                label: this.i18n('i18n-yzkyg961') /* 源代码地址 */,
                                span: 1,
                              },
                            ]}
                            labelStyle={{ width: 100 }}
                            layout="vertical"
                            size="small"
                            title={this.i18n('i18n-f6e39rd6') /* 产品介绍 */}
                          >
                            <Descriptions.Item
                              key="pi5m3iilqxj"
                              label={this.i18n('i18n-fm60ewc6') /* 组件描述 */}
                              span={1}
                            >
                              {
                                <Typography.Text
                                  __component_name="Typography.Text"
                                  disabled={false}
                                  ellipsis={true}
                                  strong={false}
                                  style={{ fontSize: '' }}
                                >
                                  {__$$eval(
                                    () =>
                                      this.props.useGetComponent?.data?.component?.description ||
                                      '-'
                                  )}
                                </Typography.Text>
                              }
                            </Descriptions.Item>
                            <Descriptions.Item
                              key="et5s0offl7d"
                              label={this.i18n('i18n-wuup4l9q') /* 组件创建时间 */}
                              span={1}
                            >
                              {
                                <Typography.Time
                                  __component_name="Typography.Time"
                                  format=""
                                  relativeTime={false}
                                  time={__$$eval(
                                    () =>
                                      this.props.useGetComponent?.data?.component?.creationTimestamp
                                  )}
                                />
                              }
                            </Descriptions.Item>
                            <Descriptions.Item
                              key="672hupxnu9c"
                              label={this.i18n('i18n-j1vviznx') /* 组件更新时间 */}
                              span={1}
                            >
                              {
                                <Typography.Time
                                  __component_name="Typography.Time"
                                  format=""
                                  relativeTime={false}
                                  time={__$$eval(
                                    () => this.props.useGetComponent?.data?.component?.updatedAt
                                  )}
                                />
                              }
                            </Descriptions.Item>
                            <Descriptions.Item
                              key="apettitpge7"
                              label={this.i18n('i18n-f34yu3md') /* 组件官网 */}
                              span={1}
                            >
                              {
                                <UnifiedLink
                                  __component_name="UnifiedLink"
                                  target="_blank"
                                  to={__$$eval(
                                    () => this.props.useGetComponent?.data?.component?.home || '-'
                                  )}
                                >
                                  {__$$eval(
                                    () => this.props.useGetComponent?.data?.component?.home || '-'
                                  )}
                                </UnifiedLink>
                              }
                            </Descriptions.Item>
                            <Descriptions.Item
                              key="636ln138sl7"
                              label={this.i18n('i18n-yzkyg961') /* 源代码地址 */}
                              span={1}
                            >
                              {
                                <Row __component_name="Row" gutter={[0, 0]} wrap={true}>
                                  {__$$evalArray(
                                    () => this.props.useGetComponent?.data?.component?.sources || []
                                  ).map((item, index) =>
                                    (__$$context => (
                                      <Col __component_name="Col" span={24}>
                                        <UnifiedLink
                                          __component_name="UnifiedLink"
                                          target="_blank"
                                          to={__$$eval(() => item)}
                                        >
                                          {__$$eval(() => item || '-')}
                                        </UnifiedLink>
                                      </Col>
                                    ))(__$$createChildContext(__$$context, { item, index }))
                                  )}
                                </Row>
                              }
                            </Descriptions.Item>
                          </Descriptions>
                        </Col>
                        <Col __component_name="Col" span={24}>
                          <Descriptions
                            __component_name="Descriptions"
                            bordered={false}
                            borderedBottom={false}
                            borderedBottomDashed={false}
                            colon={false}
                            column={1}
                            id="versions"
                            items={[
                              {
                                children: (
                                  <Typography.Text
                                    __component_name="Typography.Text"
                                    disabled={false}
                                    ellipsis={true}
                                    strong={false}
                                    style={{ fontSize: '' }}
                                  >
                                    {__$$eval(() =>
                                      this.getVersionInfo()?.version
                                        ? `${this.getVersionInfo()?.version} ${
                                            this.getVersionInfo()?.deprecated ? '（废弃）' : ''
                                          }`
                                        : '-'
                                    )}
                                  </Typography.Text>
                                ),
                                key: 'pi5m3iilqxj',
                                label: this.i18n('i18n-ekp8efeq') /* 组件版本 */,
                                span: 1,
                              },
                              {
                                children: (
                                  <Typography.Text
                                    __component_name="Typography.Text"
                                    disabled={false}
                                    ellipsis={true}
                                    strong={false}
                                    style={{ fontSize: '' }}
                                  >
                                    {__$$eval(() => this.getVersionInfo()?.appVersion || '-')}
                                  </Typography.Text>
                                ),
                                key: '8ju3wht9i04',
                                label: this.i18n('i18n-xx4ved6h') /* 应用版本 */,
                                span: 1,
                              },
                            ]}
                            labelStyle={{ width: 100 }}
                            layout="vertical"
                            size="small"
                            style={{ marginBottom: '24px', marginTop: '24px' }}
                            title={this.i18n('i18n-7e7t3bw9') /* 版本 */}
                          >
                            <Descriptions.Item
                              key="pi5m3iilqxj"
                              label={this.i18n('i18n-ekp8efeq') /* 组件版本 */}
                              span={1}
                            >
                              {
                                <Typography.Text
                                  __component_name="Typography.Text"
                                  disabled={false}
                                  ellipsis={true}
                                  strong={false}
                                  style={{ fontSize: '' }}
                                >
                                  {__$$eval(() =>
                                    this.getVersionInfo()?.version
                                      ? `${this.getVersionInfo()?.version} ${
                                          this.getVersionInfo()?.deprecated ? '（废弃）' : ''
                                        }`
                                      : '-'
                                  )}
                                </Typography.Text>
                              }
                            </Descriptions.Item>
                            <Descriptions.Item
                              key="8ju3wht9i04"
                              label={this.i18n('i18n-xx4ved6h') /* 应用版本 */}
                              span={1}
                            >
                              {
                                <Typography.Text
                                  __component_name="Typography.Text"
                                  disabled={false}
                                  ellipsis={true}
                                  strong={false}
                                  style={{ fontSize: '' }}
                                >
                                  {__$$eval(() => this.getVersionInfo()?.appVersion || '-')}
                                </Typography.Text>
                              }
                            </Descriptions.Item>
                          </Descriptions>
                        </Col>
                        <Col __component_name="Col" span={24}>
                          <Typography.Title
                            __component_name="Typography.Title"
                            bold={true}
                            bordered={false}
                            ellipsis={true}
                            level={2}
                            style={{}}
                          >
                            {this.i18n('i18n-xaa077da') /* 维护者信息 */}
                          </Typography.Title>
                        </Col>
                        <Col __component_name="Col" span={24}>
                          {__$$evalArray(
                            () => this.props.useGetComponent?.data?.component?.maintainers || []
                          ).map((item, index) =>
                            (__$$context => (
                              <Descriptions
                                __component_name="Descriptions"
                                bordered={false}
                                borderedBottom={false}
                                borderedBottomDashed={false}
                                colon={false}
                                column={1}
                                id="maintainers"
                                items={[
                                  {
                                    children: (
                                      <Typography.Text
                                        __component_name="Typography.Text"
                                        disabled={false}
                                        ellipsis={true}
                                        strong={false}
                                        style={{ fontSize: '' }}
                                      >
                                        {__$$eval(() => item?.name || '-')}
                                      </Typography.Text>
                                    ),
                                    key: 'pi5m3iilqxj',
                                    label: this.i18n('i18n-xql84ibj') /* 姓名 */,
                                    span: 1,
                                  },
                                  {
                                    children: (
                                      <Typography.Text
                                        __component_name="Typography.Text"
                                        disabled={false}
                                        ellipsis={true}
                                        strong={false}
                                        style={{ fontSize: '' }}
                                      >
                                        {__$$eval(() => item?.email || '-')}
                                      </Typography.Text>
                                    ),
                                    key: '3v0s08uuplw',
                                    label: this.i18n('i18n-3szzvcl7') /* 邮箱 */,
                                    span: 1,
                                  },
                                  {
                                    children: (
                                      <UnifiedLink
                                        __component_name="UnifiedLink"
                                        target="_blank"
                                        to={__$$eval(() => item?.url || '-')}
                                      >
                                        {__$$eval(() => item?.url || '-')}
                                      </UnifiedLink>
                                    ),
                                    key: 'plk75u4i8vt',
                                    label: this.i18n('i18n-2lcystak') /* 网站 */,
                                    span: 1,
                                  },
                                ]}
                                labelStyle={{ width: 100 }}
                                layout="vertical"
                                size="small"
                                title=""
                              >
                                <Descriptions.Item
                                  key="pi5m3iilqxj"
                                  label={this.i18n('i18n-xql84ibj') /* 姓名 */}
                                  span={1}
                                >
                                  {
                                    <Typography.Text
                                      __component_name="Typography.Text"
                                      disabled={false}
                                      ellipsis={true}
                                      strong={false}
                                      style={{ fontSize: '' }}
                                    >
                                      {__$$eval(() => item?.name || '-')}
                                    </Typography.Text>
                                  }
                                </Descriptions.Item>
                                <Descriptions.Item
                                  key="3v0s08uuplw"
                                  label={this.i18n('i18n-3szzvcl7') /* 邮箱 */}
                                  span={1}
                                >
                                  {
                                    <Typography.Text
                                      __component_name="Typography.Text"
                                      disabled={false}
                                      ellipsis={true}
                                      strong={false}
                                      style={{ fontSize: '' }}
                                    >
                                      {__$$eval(() => item?.email || '-')}
                                    </Typography.Text>
                                  }
                                </Descriptions.Item>
                                <Descriptions.Item
                                  key="plk75u4i8vt"
                                  label={this.i18n('i18n-2lcystak') /* 网站 */}
                                  span={1}
                                >
                                  {
                                    <UnifiedLink
                                      __component_name="UnifiedLink"
                                      target="_blank"
                                      to={__$$eval(() => item?.url || '-')}
                                    >
                                      {__$$eval(() => item?.url || '-')}
                                    </UnifiedLink>
                                  }
                                </Descriptions.Item>
                              </Descriptions>
                            ))(__$$createChildContext(__$$context, { item, index }))
                          )}
                        </Col>
                      </Row>
                    ),
                    key: 'info',
                    label: this.i18n('i18n-f6e39rd6') /* 产品介绍 */,
                  },
                  {
                    children: (
                      <Row __component_name="Row" wrap={true}>
                        <Col __component_name="Col" span={24}>
                          <Alert
                            __component_name="Alert"
                            icon={
                              <TenxIconTips
                                __component_name="TenxIconTips"
                                color="#8ae52b"
                                style={{ marginRight: '3px' }}
                              />
                            }
                            message={
                              <Space __component_name="Space" align="center" direction="horizontal">
                                <Typography.Text
                                  __component_name="Typography.Text"
                                  disabled={false}
                                  ellipsis={true}
                                  strong={false}
                                  style={{ fontSize: '' }}
                                >
                                  {
                                    this.i18n(
                                      'i18n-xy8qhguk'
                                    ) /* 使用智能 AI 对组件从安全性、可靠性等方面进行综合评测，为您的选择提供参考数据。 */
                                  }
                                </Typography.Text>
                                <UnifiedLink
                                  __component_name="UnifiedLink"
                                  inQianKun={false}
                                  target="_blank"
                                  to="http://kubebb.k8s.com.cn/docs/user-guide/component_rating"
                                >
                                  评测说明
                                </UnifiedLink>
                              </Space>
                            }
                            showIcon={true}
                            type="success"
                          />
                        </Col>
                        <Col __component_name="Col" span={24}>
                          <Space __component_name="Space" align="center" direction="horizontal">
                            {!!__$$eval(
                              () =>
                                this.state.ratePermission &&
                                this.state.rateEnabled &&
                                this.state.rateStatus !== 'progress'
                            ) && (
                              <Button
                                __component_name="Button"
                                block={false}
                                danger={false}
                                disabled={false}
                                ghost={false}
                                onClick={function () {
                                  return this.openRateModal.apply(
                                    this,
                                    Array.prototype.slice.call(arguments).concat([])
                                  );
                                }.bind(this)}
                                shape="default"
                                type="primary"
                              >
                                {this.i18n('i18n-99fynr0e') /* 发起评测 */}
                              </Button>
                            )}
                            {!!__$$eval(
                              () => this.state.rateResult && this.state.rateStatus === 'failed'
                            ) && (
                              <Typography.Text
                                __component_name="Typography.Text"
                                disabled={false}
                                ellipsis={true}
                                strong={false}
                                style={{ fontSize: '' }}
                              >
                                {this.i18n('i18n-59susbuv') /* 评测失败，请重试 */}
                              </Typography.Text>
                            )}
                            {!!__$$eval(() => this.state.rateStatus === 'progress') && (
                              <Button
                                __component_name="Button"
                                block={false}
                                danger={false}
                                disabled={false}
                                ghost={false}
                                loading={true}
                                shape="default"
                                type="primary"
                              >
                                {this.i18n('i18n-dzwtxz18') /* 评测中 */}
                              </Button>
                            )}
                          </Space>
                        </Col>
                        <Col __component_name="Col" span={24}>
                          {!!__$$eval(
                            () =>
                              !this.state.ratePermission &&
                              this.state.rateEnabled &&
                              !this.state.rateStatus
                          ) && (
                            <Empty
                              __component_name="Empty"
                              description={
                                this.i18n(
                                  'i18n-q2lat5ib'
                                ) /* 组件当前版本还未进行评测，请耐心等待 */
                              }
                            />
                          )}
                          {!!__$$eval(
                            () =>
                              this.state.ratePermission &&
                              this.state.rateEnabled &&
                              !this.state.rateStatus
                          ) && (
                            <Empty
                              __component_name="Empty"
                              description={
                                this.i18n(
                                  'i18n-8ss1wlic'
                                ) /* 组件当前版本还未进行评测，请开始评测吧 */
                              }
                            />
                          )}
                          {!!__$$eval(() => !this.state.rateEnabled) && (
                            <Empty
                              __component_name="Empty"
                              description={
                                this.i18n(
                                  'i18n-mdmay8nh'
                                ) /* 请联系管理员为当前仓库开启组件评测能力 */
                              }
                            />
                          )}
                          {!!__$$eval(
                            () => !this.state.rateResult && this.state.rateStatus === 'failed'
                          ) && (
                            <Empty
                              __component_name="Empty"
                              description={this.i18n('i18n-uij8fxd3') /* 评测失败，请稍后重试 */}
                            />
                          )}
                        </Col>
                        <Col __component_name="Col" span={24}>
                          {!!__$$eval(
                            () =>
                              this.state.rateEnabled &&
                              (['progress', 'success'].includes(this.state.rateStatus) ||
                                (this.state.rateResult &&
                                  ['failed'].includes(this.state.rateStatus)))
                          ) && (
                            <Spin
                              __component_name="Spin"
                              spinning={__$$eval(() => this.state.getRatingLoading)}
                            >
                              {!!__$$eval(
                                () =>
                                  this.state.rateEnabled &&
                                  (['progress', 'success'].includes(this.state.rateStatus) ||
                                    (this.state.rateResult &&
                                      ['failed'].includes(this.state.rateStatus)))
                              ) && (
                                <Descriptions
                                  __component_name="Descriptions"
                                  bordered={false}
                                  borderedBottom={false}
                                  borderedBottomDashed={false}
                                  colon={false}
                                  column={1}
                                  id=""
                                  items={[
                                    {
                                      children: [
                                        !!__$$eval(
                                          () =>
                                            ['success'].includes(this.state.rateStatus) ||
                                            (this.state.rateResult &&
                                              ['progress', 'failed'].includes(
                                                this.state.rateStatus
                                              ))
                                        ) && (
                                          <Rate
                                            __component_name="Rate"
                                            disabled={true}
                                            style={{ fontSize: '12px' }}
                                            value={__$$eval(() =>
                                              Math.round(
                                                (this.state.rateResult?.prompts?.reduce(
                                                  (v, cur) => v + cur.score,
                                                  0
                                                ) / this.state.rateResult?.prompts?.length || 1) / 2
                                              )
                                            )}
                                            key="node_oclryhbzjt2"
                                          />
                                        ),
                                        !!__$$eval(
                                          () =>
                                            !this.state.rateResult &&
                                            ['progress'].includes(this.state.rateStatus)
                                        ) && (
                                          <Typography.Text
                                            __component_name="Typography.Text"
                                            disabled={false}
                                            ellipsis={true}
                                            strong={false}
                                            style={{ fontSize: '' }}
                                            key="node_oclryhbzjt3"
                                          >
                                            {this.i18n('i18n-dzwtxz18') /* 评测中 */}
                                          </Typography.Text>
                                        ),
                                      ],
                                      key: '20vwa4mw25w',
                                      label: this.i18n('i18n-fghbypr5') /* 组件评测得分 */,
                                      span: 1,
                                    },
                                    {
                                      children: [
                                        !!__$$eval(
                                          () =>
                                            ['success'].includes(this.state.rateStatus) ||
                                            (this.state.rateResult &&
                                              ['progress', 'failed'].includes(
                                                this.state.rateStatus
                                              ))
                                        ) && (
                                          <Typography.Time
                                            __component_name="Typography.Time"
                                            format=""
                                            relativeTime={false}
                                            time={__$$eval(
                                              () => this.state.rateResult?.creationTimestamp
                                            )}
                                            key="node_oclreizx4ak"
                                          />
                                        ),
                                        !!__$$eval(
                                          () =>
                                            !this.state.rateResult &&
                                            ['progress'].includes(this.state.rateStatus)
                                        ) && (
                                          <Typography.Text
                                            __component_name="Typography.Text"
                                            disabled={false}
                                            ellipsis={true}
                                            strong={false}
                                            style={{ fontSize: '' }}
                                            key="node_oclrfzpr7f4"
                                          >
                                            {this.i18n('i18n-dzwtxz18') /* 评测中 */}
                                          </Typography.Text>
                                        ),
                                      ],
                                      key: 's2sj8l83ptb',
                                      label: this.i18n('i18n-cqhehb0a') /* 最近一次评测 */,
                                      span: 1,
                                    },
                                    {
                                      children: [
                                        !!__$$eval(
                                          () =>
                                            !this.state.rateResult &&
                                            ['progress'].includes(this.state.rateStatus)
                                        ) && (
                                          <Typography.Text
                                            __component_name="Typography.Text"
                                            disabled={false}
                                            ellipsis={true}
                                            strong={false}
                                            style={{ fontSize: '' }}
                                            key="node_oclrfzpr7f3"
                                          >
                                            {this.i18n('i18n-dzwtxz18') /* 评测中 */}
                                          </Typography.Text>
                                        ),
                                        !!__$$eval(
                                          () =>
                                            ['success'].includes(this.state.rateStatus) ||
                                            (this.state.rateResult &&
                                              ['progress', 'failed'].includes(
                                                this.state.rateStatus
                                              ))
                                        ) && (
                                          <Table
                                            __component_name="Table"
                                            columns={[
                                              {
                                                dataIndex: 'dimension',
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
                                                        () => __$$context.getRateType(text) || '-'
                                                      )}
                                                    </Typography.Text>
                                                  ))(
                                                    __$$createChildContext(__$$context, {
                                                      text,
                                                      record,
                                                      index,
                                                    })
                                                  ),
                                                title: this.i18n('i18n-gyax19ni') /* 类型 */,
                                              },
                                              {
                                                dataIndex: 'score',
                                                key: 'score',
                                                title: this.i18n('i18n-hqc66hue') /* 得分 */,
                                              },
                                              {
                                                dataIndex: 'problems',
                                                key: 'question',
                                                render: (text, record, index) =>
                                                  (__$$context => (
                                                    <Typography.Text
                                                      __component_name="Typography.Text"
                                                      disabled={false}
                                                      ellipsis={{
                                                        rows: 1,
                                                        tooltip: {
                                                          _unsafe_MixedSetter_title_select:
                                                            'VariableSetter',
                                                          title: __$$eval(() => text || '-'),
                                                        },
                                                      }}
                                                      strong={false}
                                                      style={{ fontSize: '' }}
                                                    >
                                                      {__$$eval(() => text || '-')}
                                                    </Typography.Text>
                                                  ))(
                                                    __$$createChildContext(__$$context, {
                                                      text,
                                                      record,
                                                      index,
                                                    })
                                                  ),
                                                title: this.i18n('i18n-vpbmbd4y') /* 问题 */,
                                              },
                                              {
                                                dataIndex: 'suggestions',
                                                key: 'jy',
                                                render: (text, record, index) =>
                                                  (__$$context => (
                                                    <Typography.Text
                                                      __component_name="Typography.Text"
                                                      disabled={false}
                                                      ellipsis={{
                                                        tooltip: {
                                                          _unsafe_MixedSetter_title_select:
                                                            'VariableSetter',
                                                          title: __$$eval(() => text || '-'),
                                                        },
                                                      }}
                                                      strong={false}
                                                      style={{ fontSize: '' }}
                                                    >
                                                      {__$$eval(() => text || '-')}
                                                    </Typography.Text>
                                                  ))(
                                                    __$$createChildContext(__$$context, {
                                                      text,
                                                      record,
                                                      index,
                                                    })
                                                  ),
                                                title: this.i18n('i18n-r76kh4ll') /* 建议 */,
                                              },
                                            ]}
                                            dataSource={__$$eval(
                                              () => this.state.rateResult?.prompts || []
                                            )}
                                            expandable={{
                                              expandedRowRender: (
                                                record,
                                                index,
                                                indent,
                                                expanded
                                              ) =>
                                                (__$$context => [
                                                  <Descriptions
                                                    __component_name="Descriptions"
                                                    bordered={false}
                                                    borderedBottom={false}
                                                    borderedBottomDashed={false}
                                                    colon={true}
                                                    column={1}
                                                    id=""
                                                    items={[]}
                                                    labelStyle={{ width: 100 }}
                                                    layout="horizontal"
                                                    size="default"
                                                    style={{}}
                                                    title={
                                                      this.i18n(
                                                        'i18n-whl68z2v'
                                                      ) /* 评测任务执行结果 */
                                                    }
                                                    key="node_oclreizx4ao"
                                                  >
                                                    <Descriptions.Item
                                                      key="an2oj3zs06"
                                                      label="标签项"
                                                      span={1}
                                                    >
                                                      {null}
                                                    </Descriptions.Item>
                                                  </Descriptions>,
                                                  __$$evalArray(() => record.taskList || []).map(
                                                    (item, index) =>
                                                      (__$$context => (
                                                        <Descriptions
                                                          __component_name="Descriptions"
                                                          bordered={false}
                                                          borderedBottom={false}
                                                          borderedBottomDashed={false}
                                                          colon={true}
                                                          column={1}
                                                          id=""
                                                          items={[
                                                            {
                                                              children: (
                                                                <Typography.Text
                                                                  __component_name="Typography.Text"
                                                                  disabled={false}
                                                                  ellipsis={true}
                                                                  strong={false}
                                                                  style={{ fontSize: '' }}
                                                                >
                                                                  {__$$eval(
                                                                    () => item?.taskRunName || '-'
                                                                  )}
                                                                </Typography.Text>
                                                              ),
                                                              key: 'an2oj3zs06',
                                                              label:
                                                                this.i18n(
                                                                  'i18n-jsrlhq33'
                                                                ) /* 任务名称 */,
                                                              span: 1,
                                                            },
                                                            {
                                                              children: (
                                                                <Status
                                                                  __component_name="Status"
                                                                  id={__$$eval(() => item.status)}
                                                                  types={[
                                                                    {
                                                                      children:
                                                                        this.i18n(
                                                                          'i18n-4djpnm56'
                                                                        ) /* 执行中 */,
                                                                      id: 'Running',
                                                                      type: 'info',
                                                                    },
                                                                    {
                                                                      children:
                                                                        this.i18n(
                                                                          'i18n-45kqicup'
                                                                        ) /* 完成 */,
                                                                      id: 'Succeeded',
                                                                      type: 'success',
                                                                    },
                                                                  ]}
                                                                />
                                                              ),
                                                              key: 'g8ewa2f4egw',
                                                              label:
                                                                this.i18n(
                                                                  'i18n-fc7kahkh'
                                                                ) /* 执行状态 */,
                                                              span: 1,
                                                            },
                                                            {
                                                              children: (
                                                                <Typography.Time
                                                                  __component_name="Typography.Time"
                                                                  format=""
                                                                  relativeTime={false}
                                                                  time={__$$eval(
                                                                    () => item?.lastTransitionTime
                                                                  )}
                                                                />
                                                              ),
                                                              key: '8ybmrrzif4u',
                                                              label:
                                                                this.i18n(
                                                                  'i18n-9c8ocdzq'
                                                                ) /* 结束时间 */,
                                                              span: 1,
                                                            },
                                                            {
                                                              children: (
                                                                <Typography.Text
                                                                  __component_name="Typography.Text"
                                                                  disabled={false}
                                                                  ellipsis={true}
                                                                  strong={false}
                                                                  style={{ fontSize: '' }}
                                                                >
                                                                  {__$$eval(
                                                                    () => item?.reason || '-'
                                                                  )}
                                                                </Typography.Text>
                                                              ),
                                                              key: '91n8rffca9n',
                                                              label:
                                                                this.i18n(
                                                                  'i18n-4uud9mle'
                                                                ) /* 执行结果 */,
                                                              span: 1,
                                                            },
                                                            {
                                                              children: (
                                                                <Typography.Text
                                                                  __component_name="Typography.Text"
                                                                  disabled={false}
                                                                  ellipsis={true}
                                                                  strong={false}
                                                                  style={{ fontSize: '' }}
                                                                >
                                                                  {__$$eval(
                                                                    () => item?.message || '-'
                                                                  )}
                                                                </Typography.Text>
                                                              ),
                                                              key: '3u2hkongpsd',
                                                              label:
                                                                this.i18n(
                                                                  'i18n-rsnjf9n7'
                                                                ) /* 详细信息 */,
                                                              span: 1,
                                                            },
                                                            {
                                                              children: [
                                                                !!__$$eval(
                                                                  () =>
                                                                    !(
                                                                      record?.rbac &&
                                                                      item.taskRunName.includes(
                                                                        'rback'
                                                                      )
                                                                    )
                                                                ) && (
                                                                  <Typography.Text
                                                                    __component_name="Typography.Text"
                                                                    disabled={false}
                                                                    ellipsis={true}
                                                                    strong={false}
                                                                    style={{ fontSize: '' }}
                                                                    key="node_oclrybzbmi10"
                                                                  >
                                                                    {
                                                                      this.i18n(
                                                                        'i18n-cba8wwos'
                                                                      ) /* 暂无 */
                                                                    }
                                                                  </Typography.Text>
                                                                ),
                                                                !!__$$eval(
                                                                  () =>
                                                                    record?.rbac &&
                                                                    item.taskRunName.includes(
                                                                      'rback'
                                                                    )
                                                                ) && (
                                                                  <Space
                                                                    __component_name="Space"
                                                                    align="center"
                                                                    direction="horizontal"
                                                                    size={4}
                                                                    key="node_oclrybzbmi11"
                                                                  >
                                                                    <Typography.Text
                                                                      __component_name="Typography.Text"
                                                                      disabled={false}
                                                                      ellipsis={true}
                                                                      strong={false}
                                                                      style={{ fontSize: '' }}
                                                                    >
                                                                      {
                                                                        this.i18n(
                                                                          'i18n-r4bsaa82'
                                                                        ) /*  RBAC权限图 */
                                                                      }
                                                                    </Typography.Text>
                                                                    <AntdIconDownloadOutlined
                                                                      __component_name="AntdIconDownloadOutlined"
                                                                      onClick={function () {
                                                                        return this.handleDownloadRBAC.apply(
                                                                          this,
                                                                          Array.prototype.slice
                                                                            .call(arguments)
                                                                            .concat([
                                                                              {
                                                                                record: record,
                                                                              },
                                                                            ])
                                                                        );
                                                                      }.bind(__$$context)}
                                                                      style={{
                                                                        color: '#4461eb',
                                                                        cursor: 'pointer',
                                                                      }}
                                                                    />
                                                                  </Space>
                                                                ),
                                                              ],
                                                              key: 'mg8cdkw8ue',
                                                              label:
                                                                this.i18n(
                                                                  'i18n-ns3y7tuh'
                                                                ) /* 附件 */,
                                                              span: 1,
                                                            },
                                                          ]}
                                                          labelStyle={{ width: 100 }}
                                                          layout="horizontal"
                                                          size="default"
                                                          title=""
                                                          key="node_oclrybzbmi7"
                                                        >
                                                          <Descriptions.Item
                                                            key="an2oj3zs06"
                                                            label="标签项"
                                                            span={1}
                                                          >
                                                            {null}
                                                          </Descriptions.Item>
                                                        </Descriptions>
                                                      ))(
                                                        __$$createChildContext(__$$context, {
                                                          item,
                                                          index,
                                                        })
                                                      )
                                                  ),
                                                ])(
                                                  __$$createChildContext(__$$context, {
                                                    record,
                                                    index,
                                                    indent,
                                                    expanded,
                                                  })
                                                ),
                                            }}
                                            pagination={false}
                                            rowKey="dimension"
                                            scroll={{ scrollToFirstRowOnChange: true }}
                                            showHeader={true}
                                            size="middle"
                                            style={{ width: '100%' }}
                                            key="node_oclreizx4am"
                                          />
                                        ),
                                      ],
                                      key: 'fyzu14bnuei',
                                      label: this.i18n('i18n-gipku83c') /* 组件评测报告 */,
                                      span: 1,
                                    },
                                  ]}
                                  labelStyle={{ width: 100 }}
                                  layout="horizontal"
                                  size="default"
                                  style={{}}
                                  title=""
                                >
                                  <Descriptions.Item
                                    key="20vwa4mw25w"
                                    label={this.i18n('i18n-fghbypr5') /* 组件评测得分 */}
                                    span={1}
                                  >
                                    {
                                      <Rate
                                        __component_name="Rate"
                                        style={{ fontSize: '12px' }}
                                        value={2}
                                      />
                                    }
                                  </Descriptions.Item>
                                  <Descriptions.Item
                                    key="s2sj8l83ptb"
                                    label={this.i18n('i18n-cqhehb0a') /* 最近一次评测 */}
                                    span={1}
                                  >
                                    {
                                      <Typography.Time
                                        __component_name="Typography.Time"
                                        format=""
                                        relativeTime={false}
                                        time=""
                                      />
                                    }
                                  </Descriptions.Item>
                                  <Descriptions.Item
                                    key="fyzu14bnuei"
                                    label={this.i18n('i18n-gipku83c') /* 组件评测报告 */}
                                    span={1}
                                    style={{}}
                                  >
                                    {
                                      <Table
                                        __component_name="Table"
                                        columns={[
                                          { dataIndex: 'name', key: 'name', title: '姓名' },
                                          { dataIndex: 'age', key: 'age', title: '年龄' },
                                          { title: '标题' },
                                          { title: '标题' },
                                        ]}
                                        dataSource={[
                                          {
                                            address: '西湖区湖底公园1号',
                                            age: 32,
                                            id: '1',
                                            name: '胡彦斌',
                                          },
                                          {
                                            address: '滨江区网商路699号',
                                            age: 28,
                                            id: '2',
                                            name: '王一博',
                                          },
                                        ]}
                                        expandable={{
                                          expandedRowRender: (record, index, indent, expanded) =>
                                            (__$$context => (
                                              <Descriptions
                                                __component_name="Descriptions"
                                                bordered={false}
                                                borderedBottom={false}
                                                borderedBottomDashed={false}
                                                colon={true}
                                                column={3}
                                                id=""
                                                items={[
                                                  {
                                                    children: null,
                                                    key: 'an2oj3zs06',
                                                    label: '标签项',
                                                    span: 1,
                                                  },
                                                ]}
                                                labelStyle={{ width: 100 }}
                                                layout="horizontal"
                                                size="default"
                                                title="用户信息"
                                              >
                                                <Descriptions.Item
                                                  key="an2oj3zs06"
                                                  label="标签项"
                                                  span={1}
                                                >
                                                  {null}
                                                </Descriptions.Item>
                                              </Descriptions>
                                            ))(
                                              __$$createChildContext(__$$context, {
                                                record,
                                                index,
                                                indent,
                                                expanded,
                                              })
                                            ),
                                        }}
                                        pagination={{
                                          current: 1,
                                          pageSize: 10,
                                          showQuickJumper: false,
                                          showSizeChanger: false,
                                          simple: false,
                                          size: 'default',
                                          total: 15,
                                        }}
                                        rowKey="id"
                                        scroll={{ scrollToFirstRowOnChange: true }}
                                        showHeader={true}
                                        size="middle"
                                        style={{ width: '1000px' }}
                                      />
                                    }
                                  </Descriptions.Item>
                                </Descriptions>
                              )}
                            </Spin>
                          )}
                        </Col>
                      </Row>
                    ),
                    hidden: __$$eval(() => !this.state.rateInstall),
                    key: 'rate',
                    label: this.i18n('i18n-thxp526w') /* 组件评测 */,
                  },
                  {
                    children: (
                      <TenxUiReactMarkdownLowcodeMaterials
                        __component_name="TenxUiReactMarkdownLowcodeMaterials"
                        components={{}}
                        disallowedElements={[]}
                        includeElementIndex={false}
                        plugins={[]}
                        rawSourcePos={false}
                        rehypePlugins={[]}
                        remarkPlugins={[]}
                        skipHtml={false}
                        sourcePos={false}
                        unwrapDisallowed={false}
                      >
                        {__$$eval(() => this.state.readme || '-')}
                      </TenxUiReactMarkdownLowcodeMaterials>
                    ),
                    key: 'READEME',
                    label: 'README',
                  },
                ]}
                onChange={function () {
                  return this.handleTabChange.apply(
                    this,
                    Array.prototype.slice.call(arguments).concat([])
                  );
                }.bind(this)}
                size="default"
                tabPosition="top"
                type="line"
              />
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
  const match = matchPath(
    { path: '/components/:page/:subPage/management-detail/:action/:id' },
    location.pathname
  );
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
          func: 'useGetComponent',
          params: function applyThis() {
            return {
              name: this.appHelper?.match?.params?.id,
              cluster: this.appHelper?.history?.query?.cluster,
            };
          }.apply(self),
          enableLocationSearch: undefined,
        },
      ]}
      render={dataProps => (
        <ComponentsDetail$$Page {...props} {...dataProps} self={self} appHelper={appHelper} />
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
