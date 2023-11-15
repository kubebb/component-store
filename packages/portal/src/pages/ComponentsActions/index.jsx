// 注意: 出码引擎注入的临时变量默认都以 "__$$" 开头，禁止在搭建的代码中直接访问。
// 例外：react 框架的导出名和各种组件名除外。
import React from 'react';

import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Divider,
  FormilyArrayCards,
  FormilyForm,
  FormilyFormItem,
  FormilyInput,
  FormilyRadio,
  FormilySelect,
  FormilyTimePicker,
  Page,
  Row,
  Space,
  Spin,
  Tag,
  Tooltip,
  Typography,
  UnifiedLink,
} from '@tenx-ui/materials';

import { AntdIconQuestionCircleOutlined, TenxIconTips } from '@tenx-ui/icon-materials';

import { default as Editor } from '@tenx-ui/editor';

import { getUnifiedHistory } from '@tenx-ui/utils/es/UnifiedLink/index.prod';
import { matchPath, useLocation } from '@umijs/max';
import qs from 'query-string';
import { DataProvider } from 'shared-components';

import utils, { RefsManager } from '../../utils/__utils';

import * as __$$i18n from '../../i18n';

import __$$constants from '../../__constants';

import './index.css';

class ComponentsActions$$Page extends React.Component {
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
      isCreate: true,
      creating: false,
      name: undefined,
      cluster: undefined,
      tenants: [],
      component: undefined,
      valuesYaml: '',
      yamlLoading: false,
      data: undefined,
      images: undefined,
    };
  }

  $ = refName => {
    return this._refsManager.get(refName);
  };

  $$ = refName => {
    return this._refsManager.getAll(refName);
  };

  getReademeDetailPath() {
    return `/component-store/components/market/subPage/management-detail/detail/${
      this.props.appHelper?.match?.params?.id
    }?cluster=${this.getCluster()}&tab=READEME`;
  }

  onEditorLoad(editor) {
    this.setState({
      editor,
    });
  }

  async handleInstallMethodChange(v) {
    if (v === 'auto') {
      const version = this.state.component?.versions?.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )?.[0]?.version;
      this.form()?.setValues({
        version,
      });
      this.handleVersionChange(version);
    }
  }

  async handleVersionChange(v) {
    this.setState({
      yamlLoading: true,
    });
    const res = await this.utils.bff.getComponentChart({
      name: this.props.appHelper?.match?.params?.id,
      version: v,
    });
    this.state.editor.setValue(res?.component?.chart?.valuesYaml || '');
    this.setState({
      images: res?.component?.chart?.imagesOptions,
      yamlLoading: false,
      valuesYaml: res?.component?.chart?.valuesYaml || this.state.data?.valuesYaml || '',
    });
    this.form()?.setValues({
      // iamges: {
      //   name: []
      // },

      imagesNames: res?.component?.chart?.imagesOptions?.map(item => ({
        label: `${item.registry ? item.registry + '/' : ''}${item.image}`,
        value: item.id,
      })),
    });
  }

  async validatorImagesName(value, ...payload) {
    const values = this.form()?.values;
    const curIndex = payload?.[1]?.field?.index;
    const currItem = values?.images?.name?.[curIndex];
    const curImage = this.state.images?.find(item => item.id === value);
    !currItem?.newPath &&
      this.form().setValuesIn(`images.name.${curIndex}.newPath`, curImage?.path);
    !currItem?.newRegistry &&
      this.form().setValuesIn(`images.name.${curIndex}.newRegistry`, curImage?.registry);
    const pathPre = payload?.[1]?.field?.props?.basePath?.entire;
    if (this.state.images?.some(item => item.id === value && item.matched)) {
      this.form().setFormGraph({
        [pathPre + '.newRegistry']: {
          pattern: 'disabled',
        },
        [pathPre + '.newPath']: {
          pattern: 'disabled',
        },
      });
    } else {
      this.form().setFormGraph({
        [pathPre + '.newRegistry']: {
          pattern: 'editable',
        },
        [pathPre + '.newPath']: {
          pattern: 'editable',
        },
      });
    }
    // 重复校验
    try {
      if (
        value &&
        values?.images?.name?.some(
          (item, index) => item.name === currItem?.name && curIndex !== index
        )
      ) {
        return this.i18n('i18n-9al8mu54');
      }
    } catch (e) {}
  }

  setFormValues(values) {
    if (!this.form()) {
      setTimeout(() => {
        this.setFormValues(values);
      }, 200);
      return;
    }
    this.form().setValues(values);
  }

  async loadComponent(callback) {
    const res = await this.props.appHelper?.utils?.bff?.getComponent({
      name: this.props.appHelper?.match?.params?.id,
      cluster: this.getCluster(),
    });
    this.setState(
      {
        component: res?.component,
      },
      () => {
        callback && callback();
      }
    );
    this.form()?.setFieldState('version', {
      dataSource:
        res?.component?.versions?.map(item => ({
          value: item.version,
          label: item.version,
        })) || [],
    });
    this.setFormValues({
      chartName: res?.component?.chartName,
      repository: res?.component?.repository,
      file: 'values.yaml',
    });
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

  getCluster() {
    const cluster = this.appHelper?.history?.query?.cluster;
    return cluster;
  }

  getClusterInfo() {
    return this.state.cluster;
  }

  async loadTenants() {
    const restrictedTenants = this.state.component.restrictedTenants;
    const restrictedNamespaces = this.state.component.restrictedNamespaces;
    const res = await this.props.appHelper?.utils?.bffSdk?.getCurrentUserTenants();
    const tenants =
      res?.userCurrent?.tenants
        ?.filter(item => {
          if (restrictedTenants?.length > 0) {
            return restrictedTenants.includes(item.name);
          }
          return true;
        })
        ?.map(item => {
          item.projects =
            item.projects
              ?.filter(item => {
                return item.clusters?.some(cluster => cluster.name === this.getCluster());
              })
              ?.filter(item =>
                restrictedNamespaces?.length > 0 ? restrictedNamespaces.includes(item.name) : true
              )
              ?.map(item => ({
                label: item.fullName,
                value: item.name,
              })) || [];
          return {
            label: item.fullName,
            value: JSON.stringify(item),
          };
        }) || [];
    this.form()?.setFieldState('position.tenant', {
      dataSource: tenants || [],
    });
    this.setState({
      tenants,
    });
  }

  async initEditor(v) {
    if (!v.valuesYaml && v) {
      const res = await this.utils.bff.getComponentChart({
        name: this.props.appHelper?.match?.params?.id,
        version: v.version,
      });
      v.valuesYaml = res?.component?.chart?.valuesYaml || '';
    }
    if (this.state.editor && !this.state.isCreate) {
      this.setState({
        valuesYaml: v.valuesYaml || '',
      });
      this.state.editor.setValue(v.valuesYaml || '');
      return;
    }
    setTimeout(() => {
      this.initEditor(v);
    }, 200);
  }

  initForms(v) {
    if (this.form() && !this.state.isCreate && this.state.component) {
      this.form().setValues({
        // repository: v.component?.repository,
        // chartName: v.component?.chartName,
        releaseName: v.releaseName,
        version: v.version,
        method: {
          componentPlanInstallMethod: v?.subscription?.componentPlanInstallMethod || 'manual',
          schedule:
            v?.subscription?.schedule && this.utils.cronChangeToDate(v?.subscription?.schedule),
        },
        images: {
          name: v.images?.map(item => {
            // edit matched
            return {
              image: item.id,
              newRegistry: item.registry,
              newPath: item.path,
              newName: item.name,
              newTag: item.tag,
            };
          }),
        },
      });
      this.initDisabled();
      return;
    }
    setTimeout(() => {
      this.initForms(v);
    }, 200);
  }

  initDisabled() {
    if (!this.form() || !this.state.images) {
      setTimeout(() => {
        this.initDisabled();
      }, 200);
      return;
    }
    const formGraph = this.form().getFormGraph();
    Object.keys(formGraph || {}).forEach(key => {
      const pathPre = key.slice(0, key.indexOf('.image'));
      if (
        key.endsWith('.image') &&
        this.state.images?.some(item => item.id === formGraph[key]?.value && item.matched)
      ) {
        this.form().setFormGraph({
          [pathPre + '.newRegistry']: {
            pattern: 'disabled',
          },
          [pathPre + '.newPath']: {
            pattern: 'disabled',
          },
        });
      }
    });
  }

  async initEdit() {
    try {
      const res = await this.props?.appHelper?.utils?.bff?.getComponentplan({
        name: this.appHelper?.history?.query?.name,
        cluster: this.getCluster(),
        namespace: this.utils.getAuthData()?.project,
      });
      const v = res?.componentplan || {};
      this.setState({
        data: v,
      });
      this.initForms(v);
      this.initEditor(v);
      this.handleVersionChange(res?.componentplan?.version);
    } catch (e) {}
  }

  async validatorName(value) {
    const namespace = this.form()?.values?.position?.namespace;
    try {
      if (value && this.state.isCreate && namespace) {
        const res = await this.props?.appHelper?.utils?.bff?.getComponentplans({
          releaseName: value,
          cluster: this.getCluster(),
          namespace,
        });
        if (res?.componentplans?.some(item => item.releaseName === value)) {
          return this.i18n('i18n-1y09ypgx');
        }
      }
    } catch (e) {}
  }

  validatorTenant(value) {
    const tenant = value && JSON.parse(value)?.name;
    if (
      tenant &&
      this.state.component.restrictedTenants?.length > 0 &&
      !this.state.component.restrictedTenants?.includes(tenant)
    ) {
      return `${this.i18n('i18n-vmtf504c')} ${this.state.component.restrictedTenants.join(
        ','
      )} ${this.i18n('i18n-qv53budt')}`;
    }
  }

  validatorNamespace(value) {
    if (
      value &&
      this.state.component.restrictedNamespaces?.length > 0 &&
      !this.state.component.restrictedNamespaces?.includes(value)
    ) {
      return `${this.i18n('i18n-n6vl1gm6')} ${this.state.component.restrictedNamespaces.join(
        ','
      )} ${this.i18n('i18n-qv53budt')}`;
    }
  }

  onCancel(event) {
    this.history.go(-1);
  }

  form(name) {
    return this.$(name || 'formily_create')?.formRef?.current?.form;
  }

  handleYamlChange(v) {
    this.setState({
      valuesYaml: v || '',
    });
  }

  onSubmit(event) {
    const { isCreate, name } = this.state;
    const form = this.form();
    form.submit(async v => {
      this.setState({
        creating: true,
      });
      const params = {
        chartName: v.chartName,
        releaseName: v.releaseName,
        repository: v.repository,
        version: v.version,
        componentPlanInstallMethod: v.method?.componentPlanInstallMethod,
        schedule:
          v.method?.schedule &&
          this.utils.dateChangeToCron({
            time: v.method?.schedule,
          }),
        valuesYaml: this.state.valuesYaml,
        images: v.images?.name?.map(item => {
          return {
            id: item.image,
            registry: item.newRegistry,
            path: item.newPath,
            name: item.newName,
            tag: item.newTag,
          };
        }),
      };
      if (!isCreate) {
        delete params.repository;
        delete params.chartName;
        delete params.releaseName;
      }
      const namespace = v.position?.namespace || this.utils.getAuthData()?.project;
      const api = {
        create: {
          name: 'createComponentplan',
          params: {
            componentplan: params,
            cluster: this.getCluster(),
            namespace,
          },
          successMessage: 'i18n-ggm37j8s',
          faildMessage: 'i18n-zo0i5o86',
        },
        update: {
          name: 'updateComponentplan',
          params: {
            cluster: this.getCluster(),
            componentplan: params,
            name: this.appHelper?.history?.query?.name,
            namespace,
          },
          successMessage: 'i18n-pi0gpejn',
          faildMessage: 'i18n-b9vob3ep',
        },
      }[isCreate ? 'create' : 'update'];
      try {
        const res = await this.props.appHelper.utils.bff[api.name](api.params);
        this.utils.notification.success({
          message: this.i18n(api.successMessage),
        });
        // this.onCancel()

        const tenantId =
          this.form()?.values?.position?.tenant || this.utils.getAuthData()?.tenant?.id;
        const path = `/components/management/install?changeCluster=${this.getCluster()}&changeProject=${namespace}&changeTenant=${tenantId}`;
        this.appHelper.history?.push(path);
        this.setState({
          creating: false,
        });
      } catch (error) {
        this.utils.notification.warnings({
          message: this.i18n(api.faildMessage),
          errors: error?.response?.errors,
        });
        this.setState({
          creating: false,
        });
      }
    });
  }

  componentDidMount() {
    this.loadCluster();
    this.loadComponent(() => {
      this.loadTenants();
    });
    const isCreate = this.props.appHelper?.match?.params?.action === 'install';
    this.setState(
      {
        isCreate,
        name: this.props.appHelper?.match?.params?.id,
      },
      () => {
        if (!isCreate) {
          this.initEdit();
        }
      }
    );
  }

  render() {
    const __$$context = this._context || this;
    const { state } = __$$context;
    return (
      <Page>
        <Row wrap={true} __component_name="Row">
          <Col span={24} __component_name="Col">
            <Space align="center" direction="horizontal" __component_name="Space">
              <Button.Back
                name={this.i18n('i18n-86so9ago') /* 返回 */}
                type="primary"
                title={__$$eval(() =>
                  this.props.appHelper?.match?.params?.action === this.i18n('i18n-eo4gqliw')
                    ? '组件安装'
                    : this.i18n('i18n-2ugh3v5e')
                )}
                __component_name="Button.Back"
              />
            </Space>
            {!!__$$eval(() => this.props.appHelper?.match?.params?.action === 'install') && (
              <Tag
                color="rgba(0,0,0,0.65)"
                style={{
                  position: 'relative',
                  marginTop: '-5px',
                  marginLeft: '16px',
                  marginRight: '0px',
                  borderRadius: '0',
                }}
                closable={false}
                __component_name="Tag"
              >
                {this.i18n('i18n-yfkq2xqq') /* 集群 */}
              </Tag>
            )}
            {!!__$$eval(() => this.props.appHelper?.match?.params?.action === 'install') && (
              <Tag
                color="#ffffff"
                style={{
                  color: 'rgba(0,0,0,0.8)',
                  position: 'relative',
                  marginTop: '-5px',
                  borderRadius: '0',
                }}
                closable={false}
                __component_name="Tag"
              >
                {__$$eval(() => this.getClusterInfo()?.fullName || '-')}
              </Tag>
            )}
          </Col>
          <Col span={24} __component_name="Col">
            <Card
              size="default"
              type="default"
              actions={[]}
              loading={false}
              bordered={false}
              hoverable={false}
              __component_name="Card"
            >
              <Alert
                icon={
                  <TenxIconTips
                    size={14}
                    color="#7ed321"
                    style={{ marginRight: '8px' }}
                    __component_name="TenxIconTips"
                  />
                }
                type="success"
                style={{ marginBottom: '20px' }}
                message={
                  <Space align="center" direction="horizontal" __component_name="Space">
                    <Typography.Text
                      style={{ fontSize: '' }}
                      strong={false}
                      disabled={false}
                      ellipsis={true}
                      __component_name="Typography.Text"
                    >
                      {this.i18n('i18n-agx7sv3d') /* 阅读组件安装说明，助您快速部署体验 */}
                    </Typography.Text>
                    <UnifiedLink
                      to={__$$eval(() => this.getReademeDetailPath())}
                      target="_blank"
                      __component_name="UnifiedLink"
                    >
                      {this.i18n('i18n-6yyi2qu9') /* 安装说明>> */}
                    </UnifiedLink>
                  </Space>
                }
                showIcon={true}
                __component_name="Alert"
              />
              <FormilyForm
                ref={this._refsManager.linkRef('formily_create')}
                formHelper={{ autoFocus: true }}
                componentProps={{
                  colon: false,
                  layout: 'horizontal',
                  labelCol: 3,
                  labelAlign: 'left',
                  wrapperCol: 20,
                }}
                __component_name="FormilyForm"
              >
                <FormilyInput
                  style={{ width: '680px' }}
                  fieldProps={{
                    name: 'releaseName',
                    title: this.i18n('i18n-wwsgwkdl') /* 部署名称 */,
                    required: true,
                    'x-pattern': __$$eval(() =>
                      this.props.appHelper?.match?.params?.action === 'install'
                        ? 'editable'
                        : 'disabled'
                    ),
                    'x-validator': [
                      {
                        id: 'disabled',
                        type: 'disabled',
                        message:
                          this.i18n(
                            'i18n-j0gqw15r'
                          ) /* 由3~53个小写字母、数字、中划线“-”组成，并以字母、数字开头或结尾 */,
                        pattern: __$$eval(() =>
                          this.utils.getNameReg({
                            max: 53,
                            noDot: true,
                          })
                        ),
                        children: '未知',
                      },
                      {
                        id: 'disabled',
                        type: 'disabled',
                        message: '',
                        children: '未知',
                        validator: function () {
                          return this.validatorName.apply(
                            this,
                            Array.prototype.slice.call(arguments).concat([])
                          );
                        }.bind(this),
                        triggerType: 'onBlur',
                      },
                    ],
                  }}
                  componentProps={{
                    'x-component-props': {
                      placeholder: this.i18n('i18n-5jsxr8i5') /* 请输入部署名称 */,
                    },
                  }}
                  decoratorProps={{
                    'x-decorator-props': {
                      fullness: false,
                      labelWidth: '',
                      wrapperWidth: '',
                      labelEllipsis: true,
                    },
                  }}
                  __component_name="FormilyInput"
                />
                <FormilyInput
                  style={{ width: '680px' }}
                  fieldProps={{
                    name: 'chartName',
                    title: this.i18n('i18n-cuf6u4di') /* 组件名称 */,
                    required: true,
                    'x-pattern': 'disabled',
                    'x-validator': [],
                  }}
                  componentProps={{
                    'x-component-props': {
                      placeholder: this.i18n('i18n-ppoohtxl') /* 请输入组件名称 */,
                    },
                  }}
                  decoratorProps={{ 'x-decorator-props': { labelEllipsis: true } }}
                  __component_name="FormilyInput"
                />
                <FormilyInput
                  style={{ width: '680px' }}
                  fieldProps={{
                    name: 'repository',
                    title: this.i18n('i18n-1po87kgw') /* 组件仓库 */,
                    required: true,
                    'x-pattern': 'disabled',
                    'x-validator': [],
                  }}
                  componentProps={{
                    'x-component-props': {
                      placeholder: this.i18n('i18n-5ndvc0c5') /* 请输入组件仓库名称 */,
                    },
                  }}
                  decoratorProps={{ 'x-decorator-props': { labelEllipsis: true } }}
                  __component_name="FormilyInput"
                />
                <FormilyFormItem
                  fieldProps={{
                    name: 'method',
                    title: (
                      <Space
                        size={3}
                        align="center"
                        direction="horizontal"
                        __component_name="Space"
                      >
                        <Typography.Text
                          style={{ fontSize: '' }}
                          strong={false}
                          disabled={false}
                          ellipsis={true}
                          __component_name="Typography.Text"
                        >
                          {this.i18n('i18n-5u3ohmy6') /* 更新方式 */}
                        </Typography.Text>
                        <Tooltip
                          title={
                            <Row wrap={true} gutter={[0, 0]} __component_name="Row">
                              <Col span={24} __component_name="Col">
                                <Typography.Text
                                  style={{ color: 'white', fontSize: '' }}
                                  strong={false}
                                  disabled={false}
                                  ellipsis={false}
                                  __component_name="Typography.Text"
                                >
                                  {
                                    this.i18n(
                                      'i18n-6lxj84mp'
                                    ) /* 手动更新，即组件有新版本时，用户手动安装新版本 */
                                  }
                                </Typography.Text>
                              </Col>
                              <Col span={24} __component_name="Col">
                                <Typography.Text
                                  style={{ color: 'white', fontSize: '' }}
                                  strong={false}
                                  disabled={false}
                                  ellipsis={false}
                                  __component_name="Typography.Text"
                                >
                                  {
                                    this.i18n(
                                      'i18n-87myvm9c'
                                    ) /* 自动更新，即组件有新版本时，按设置自动更新 */
                                  }
                                </Typography.Text>
                              </Col>
                              <Col span={24} style={{}} __component_name="Col">
                                <Typography.Text
                                  style={{ color: 'white', fontSize: '' }}
                                  strong={false}
                                  disabled={false}
                                  ellipsis={false}
                                  __component_name="Typography.Text"
                                >
                                  {
                                    this.i18n(
                                      'i18n-89zbhcux'
                                    ) /* 未设置时间，则立即触发更新，请谨慎选择！ */
                                  }
                                </Typography.Text>
                              </Col>
                              <Col span={24} __component_name="Col">
                                <Typography.Text
                                  style={{ color: 'white', fontSize: '' }}
                                  strong={false}
                                  disabled={false}
                                  ellipsis={true}
                                  __component_name="Typography.Text"
                                >
                                  {
                                    this.i18n(
                                      'i18n-jmfs26ru'
                                    ) /* 选择时间后，则按设置时间主动触发更新 */
                                  }
                                </Typography.Text>
                              </Col>
                              <Col span={24} __component_name="Col">
                                <Typography.Text
                                  style={{ color: 'white', fontSize: '' }}
                                  strong={false}
                                  disabled={false}
                                  ellipsis={true}
                                  __component_name="Typography.Text"
                                >
                                  {this.i18n('i18n-spvoti5u') /* 自动更新，同时会自动订阅此组件 */}
                                </Typography.Text>
                              </Col>
                            </Row>
                          }
                          placement="right"
                          __component_name="Tooltip"
                          overlayInnerStyle={{ width: '300px' }}
                        >
                          <Container
                            color="colorTextSecondary"
                            style={{ margin: '1px 0 0 2px' }}
                            __component_name="Container"
                          >
                            <AntdIconQuestionCircleOutlined
                              style={{ color: '' }}
                              __component_name="AntdIconQuestionCircleOutlined"
                            />
                          </Container>
                        </Tooltip>
                      </Space>
                    ),
                    'x-component': 'FormilyFormItem',
                    'x-validator': [],
                    _unsafe_MixedSetter_title_select: 'SlotSetter',
                  }}
                  decoratorProps={{ 'x-decorator-props': { asterisk: true, labelEllipsis: false } }}
                  __component_name="FormilyFormItem"
                >
                  <FormilySelect
                    style={{ width: '680px' }}
                    fieldProps={{
                      enum: __$$eval(() => this.utils.getComponentInstallMethods(this)),
                      name: 'componentPlanInstallMethod',
                      title: '',
                      default: 'manual',
                      required: true,
                      'x-validator': [],
                      _unsafe_MixedSetter_enum_select: 'ExpressionSetter',
                      _unsafe_MixedSetter_default_select: 'StringSetter',
                    }}
                    componentProps={{
                      'x-component-props': {
                        disabled: false,
                        onChange: function () {
                          return this.handleInstallMethodChange.apply(
                            this,
                            Array.prototype.slice.call(arguments).concat([])
                          );
                        }.bind(this),
                        allowClear: false,
                        placeholder: this.i18n('i18n-t05r1cpz') /* 请选择更新方式 */,
                        _sdkSwrGetFunc: {},
                      },
                    }}
                    decoratorProps={{ 'x-decorator-props': { labelEllipsis: true } }}
                    __component_name="FormilySelect"
                  />
                  <FormilyTimePicker
                    style={{ width: '680px' }}
                    fieldProps={{
                      name: 'schedule',
                      title: '',
                      required: false,
                      'x-display':
                        "{{$form.values.method?.componentPlanInstallMethod === 'auto' ? 'visible': 'hidden'}}",
                      'x-validator': [],
                    }}
                    componentProps={{
                      'x-component-props': {
                        format: 'HH:mm',
                        disabled: false,
                        allowClear: true,
                        placeholder:
                          this.i18n(
                            'i18n-daozlce9'
                          ) /* 请选择时间（每天），未设置即有新版本发布后立即更新 */,
                      },
                    }}
                    decoratorProps={{ 'x-decorator-props': { labelEllipsis: true } }}
                    __component_name="FormilyTimePicker"
                  />
                </FormilyFormItem>
                <FormilySelect
                  style={{ width: '680px' }}
                  fieldProps={{
                    enum: [],
                    name: 'version',
                    title: this.i18n('i18n-ekp8efeq') /* 组件版本 */,
                    required: true,
                    'x-pattern': '',
                    'x-validator': [],
                    _unsafe_MixedSetter_enum_select: 'ArraySetter',
                  }}
                  componentProps={{
                    'x-component-props': {
                      disabled:
                        "{{$form.values?.method?.componentPlanInstallMethod === 'auto' ? true : false}}",
                      onChange: function () {
                        return this.handleVersionChange.apply(
                          this,
                          Array.prototype.slice.call(arguments).concat([])
                        );
                      }.bind(this),
                      allowClear: false,
                      placeholder: this.i18n('i18n-lbw8wy6i') /* 请选择组件版本 */,
                      _sdkSwrGetFunc: {},
                    },
                  }}
                  decoratorProps={{ 'x-decorator-props': { labelEllipsis: true } }}
                  __component_name="FormilySelect"
                />
                {!!__$$eval(() => this.props.appHelper?.match?.params?.action === 'install') && (
                  <FormilyFormItem
                    fieldProps={{
                      name: 'position',
                      title: this.i18n('i18n-l46z9szm') /* 安装位置 */,
                      'x-component': 'FormilyFormItem',
                      'x-validator': [],
                      _unsafe_MixedSetter_title_select: 'I18nSetter',
                    }}
                    decoratorProps={{
                      'x-decorator-props': { asterisk: true, labelEllipsis: true },
                    }}
                    __component_name="FormilyFormItem"
                  >
                    <Space align="center" direction="horizontal" __component_name="Space">
                      <FormilySelect
                        style={{ width: '330px' }}
                        fieldProps={{
                          enum: [],
                          name: 'tenant',
                          title: '',
                          required: true,
                          'x-pattern': __$$eval(() =>
                            this.props.appHelper?.match?.params?.action === 'install'
                              ? 'editable'
                              : 'disabled'
                          ),
                          'x-validator': [
                            {
                              id: 'disabled',
                              type: 'disabled',
                              children: '未知',
                              validator: function () {
                                return this.validatorTenant.apply(
                                  this,
                                  Array.prototype.slice.call(arguments).concat([])
                                );
                              }.bind(this),
                            },
                          ],
                          _unsafe_MixedSetter_enum_select: 'ArraySetter',
                        }}
                        componentProps={{
                          'x-component-props': {
                            disabled: false,
                            allowClear: false,
                            placeholder: this.i18n('i18n-lhvq14lg') /* 请选择租户 */,
                            _sdkSwrGetFunc: {},
                          },
                        }}
                        decoratorProps={{ 'x-decorator-props': { labelEllipsis: true } }}
                        __component_name="FormilySelect"
                      />
                      <FormilySelect
                        style={{ width: '340px' }}
                        fieldProps={{
                          enum: '{{(() => {return $form?.values?.position?.tenant ? JSON.parse($form?.values?.position?.tenant)?.projects : []})()}}',
                          name: 'namespace',
                          required: true,
                          'x-pattern': __$$eval(() =>
                            this.props.appHelper?.match?.params?.action === 'install'
                              ? 'editable'
                              : 'disabled'
                          ),
                          'x-validator': [
                            {
                              id: 'disabled',
                              type: 'disabled',
                              children: '未知',
                              validator: function () {
                                return this.validatorNamespace.apply(
                                  this,
                                  Array.prototype.slice.call(arguments).concat([])
                                );
                              }.bind(this),
                            },
                          ],
                        }}
                        componentProps={{
                          'x-component-props': {
                            disabled: false,
                            allowClear: false,
                            placeholder: this.i18n('i18n-er0hhc9i') /* 请选择项目 */,
                            _sdkSwrGetFunc: {},
                          },
                        }}
                        decoratorProps={{ 'x-decorator-props': { labelEllipsis: true } }}
                        __component_name="FormilySelect"
                      />
                    </Space>
                  </FormilyFormItem>
                )}
                {!!false && (
                  <FormilyRadio
                    fieldProps={{
                      enum: [
                        { label: this.i18n('i18n-ff8jkxhb') /* 是 */, value: 'yes' },
                        { label: this.i18n('i18n-9jr0zllc') /* 否 */, value: 'no' },
                      ],
                      name: 'autocreate',
                      title: this.i18n('i18n-5muxxuds') /* 自动创建菜单 */,
                      default: 'yes',
                      required: true,
                      'x-validator': [],
                    }}
                    componentProps={{
                      'x-component-props': {
                        size: 'middle',
                        disabled: false,
                        buttonStyle: 'outline',
                        _sdkSwrGetFunc: {},
                      },
                    }}
                    decoratorProps={{ 'x-decorator-props': { labelEllipsis: true } }}
                    __component_name="FormilyRadio"
                  />
                )}
                <Divider
                  mode="default"
                  style={{}}
                  dashed={true}
                  content={[null]}
                  children=""
                  defaultOpen={true}
                  orientation="left"
                  __component_name="Divider"
                  orientationMargin="10px"
                >
                  <Typography.Title
                    bold={true}
                    level={2}
                    style={{ top: '1px', position: 'relative' }}
                    bordered={false}
                    ellipsis={true}
                    __component_name="Typography.Title"
                  >
                    {this.i18n('i18n-9g3poyvk') /* 组件配置 */}
                  </Typography.Title>
                </Divider>
                <FormilySelect
                  style={{ width: '680px' }}
                  fieldProps={{
                    enum: [
                      {
                        id: 'disabled',
                        type: 'disabled',
                        value: 'values.yaml',
                        children: 'values.yaml',
                      },
                    ],
                    name: 'file',
                    title: this.i18n('i18n-t6iwy9l2') /* 配置文件 */,
                    'x-validator': [],
                    _unsafe_MixedSetter_default_select: 'StringSetter',
                  }}
                  componentProps={{
                    'x-component-props': {
                      disabled: false,
                      allowClear: false,
                      placeholder: this.i18n('i18n-8cxh8m92') /* 请选择配置文件 */,
                      _sdkSwrGetFunc: {},
                    },
                  }}
                  decoratorProps={{ 'x-decorator-props': { labelEllipsis: true } }}
                  __component_name="FormilySelect"
                />
                <Row wrap={false} __component_name="Row">
                  <Col flex="" span={3} __component_name="Col" />
                  <Col flex="auto" __component_name="Col">
                    <Spin spinning={__$$eval(() => this.state.yamlLoading)} __component_name="Spin">
                      <Editor
                        style={{ marginBottom: '22px' }}
                        value={__$$eval(() => this.state.valuesYaml)}
                        height="300px"
                        onLoad={function () {
                          return this.onEditorLoad.apply(
                            this,
                            Array.prototype.slice.call(arguments).concat([])
                          );
                        }.bind(this)}
                        onChange={function () {
                          return this.handleYamlChange.apply(
                            this,
                            Array.prototype.slice.call(arguments).concat([])
                          );
                        }.bind(this)}
                        placeholder=""
                        defaultValue={__$$eval(() => this.state.valuesYaml)}
                        styleVersion="kubebb"
                        __component_name="Editor"
                      />
                    </Spin>
                  </Col>
                </Row>
                <FormilyFormItem
                  fieldProps={{
                    name: 'images',
                    title: this.i18n('i18n-trftxv8p') /* 镜像替换 */,
                    'x-component': 'FormilyFormItem',
                    'x-validator': [],
                    _unsafe_MixedSetter_title_select: 'I18nSetter',
                  }}
                  decoratorProps={{ 'x-decorator-props': { labelEllipsis: true } }}
                  __component_name="FormilyFormItem"
                >
                  <FormilyArrayCards
                    fieldProps={{
                      name: 'name',
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          Index: {
                            type: 'void',
                            'x-component': 'FormilyArrayCards.Index',
                            'x-decorator': 'FormItem',
                          },
                          Remove: {
                            type: 'void',
                            'x-component': 'FormilyArrayCards.Remove',
                            'x-decorator': 'FormItem',
                          },
                        },
                      },
                      properties: {
                        add: {
                          type: 'void',
                          title: this.i18n('i18n-1vi37ku6') /* 添加 */,
                          'x-component': 'FormilyArrayCards.Addition',
                        },
                      },
                      'x-validator': [],
                    }}
                    decoratorProps={{ 'x-decorator-props': { labelEllipsis: true } }}
                    __component_name="FormilyArrayCards"
                  >
                    <Space
                      size="large"
                      align="center"
                      direction="horizontal"
                      __component_name="Space"
                    >
                      <Space
                        align="center"
                        style={{ display: 'flex', alignItems: 'flex-start' }}
                        direction="horizontal"
                        __component_name="Space"
                      >
                        <FormilySelect
                          style={{ width: '170px' }}
                          fieldProps={{
                            enum: '{{ $form?.values?.imagesNames|| []}}',
                            name: 'image',
                            title: '',
                            'x-validator': [
                              {
                                id: 'disabled',
                                type: 'disabled',
                                children: '未知',
                                validator: function () {
                                  return this.validatorImagesName.apply(
                                    this,
                                    Array.prototype.slice.call(arguments).concat([])
                                  );
                                }.bind(this),
                              },
                            ],
                            _unsafe_MixedSetter_enum_select: 'ExpressionSetter',
                          }}
                          componentProps={{
                            'x-component-props': {
                              disabled: false,
                              allowClear: false,
                              placeholder: this.i18n('i18n-47o9s8dw') /* 选择已有镜像 */,
                              _sdkSwrGetFunc: {},
                            },
                          }}
                          decoratorProps={{ 'x-decorator-props': { labelEllipsis: true } }}
                          __component_name="FormilySelect"
                        />
                        <Typography.Text
                          style={{ fontSize: '' }}
                          strong={false}
                          disabled={false}
                          ellipsis={true}
                          __component_name="Typography.Text"
                        >
                          {this.i18n('i18n-xeckog8e') /* 替换为 */}
                        </Typography.Text>
                      </Space>
                      <Space
                        align="center"
                        style={{ display: 'flex', alignItems: 'flex-start' }}
                        direction="horizontal"
                        __component_name="Space"
                      >
                        <FormilyInput
                          style={{ width: '170px' }}
                          fieldProps={{
                            name: 'newRegistry',
                            title: '',
                            'x-pattern': 'editable',
                            'x-validator': [],
                          }}
                          componentProps={{
                            'x-component-props': {
                              placeholder: this.i18n('i18n-0oa9ae8g') /* 新域名 */,
                            },
                          }}
                          decoratorProps={{ 'x-decorator-props': { labelEllipsis: true } }}
                          __component_name="FormilyInput"
                        />
                        <FormilyInput
                          style={{ width: '170px' }}
                          fieldProps={{
                            name: 'newPath',
                            title: '',
                            'x-pattern': 'editable',
                            'x-validator': [],
                          }}
                          componentProps={{
                            'x-component-props': {
                              placeholder: this.i18n('i18n-v8m8fg5l') /* 新仓库组 */,
                            },
                          }}
                          decoratorProps={{ 'x-decorator-props': { labelEllipsis: true } }}
                          __component_name="FormilyInput"
                        />
                        <FormilyInput
                          style={{ width: '170px' }}
                          fieldProps={{ name: 'newName', title: '', 'x-validator': [] }}
                          componentProps={{
                            'x-component-props': {
                              placeholder: this.i18n('i18n-1gb2xaxt') /* 新镜像名称(非必填) */,
                            },
                          }}
                          decoratorProps={{ 'x-decorator-props': { labelEllipsis: true } }}
                          __component_name="FormilyInput"
                        />
                        <Typography.Text
                          style={{ fontSize: '' }}
                          strong={false}
                          disabled={false}
                          ellipsis={true}
                          __component_name="Typography.Text"
                        >
                          :
                        </Typography.Text>
                        <FormilyInput
                          style={{ width: '170px' }}
                          fieldProps={{ name: 'newTag', title: '', 'x-validator': [] }}
                          componentProps={{
                            'x-component-props': {
                              placeholder: this.i18n('i18n-9u5a4f3f') /* 新tag/新digest(非必填) */,
                            },
                          }}
                          decoratorProps={{ 'x-decorator-props': { labelEllipsis: true } }}
                          __component_name="FormilyInput"
                        />
                      </Space>
                    </Space>
                  </FormilyArrayCards>
                </FormilyFormItem>
                <Divider
                  mode="line"
                  style={{ width: 'calc(100% + 48px)', marginLeft: '-24px' }}
                  dashed={false}
                  defaultOpen={false}
                  __component_name="Divider"
                />
                <FormilyFormItem
                  fieldProps={{
                    name: 'FormilyFormItem15',
                    title: (
                      <Row wrap={true} style={{}} __component_name="Row">
                        <Col span={24} __component_name="Col" />
                      </Row>
                    ),
                    'x-component': 'FormilyFormItem',
                    'x-validator': [],
                    _unsafe_MixedSetter_title_select: 'SlotSetter',
                  }}
                  componentProps={{ 'x-component-props': {} }}
                  __component_name="FormilyFormItem"
                >
                  <Space align="center" direction="horizontal" __component_name="Space">
                    <Button
                      block={false}
                      ghost={false}
                      shape="default"
                      danger={false}
                      onClick={function () {
                        return this.onCancel.apply(
                          this,
                          Array.prototype.slice.call(arguments).concat([])
                        );
                      }.bind(this)}
                      disabled={false}
                      __component_name="Button"
                    >
                      {this.i18n('i18n-46k1aoak') /* 取消 */}
                    </Button>
                    <Button
                      type="primary"
                      block={false}
                      ghost={false}
                      shape="default"
                      danger={false}
                      loading={__$$eval(() => this.state.creating)}
                      onClick={function () {
                        return this.onSubmit.apply(
                          this,
                          Array.prototype.slice.call(arguments).concat([])
                        );
                      }.bind(this)}
                      disabled={false}
                      __component_name="Button"
                    >
                      {this.i18n('i18n-mgpcpuj5') /* 确定 */}
                    </Button>
                    {!!__$$eval(
                      () => this.props.appHelper?.match?.params?.action !== 'install'
                    ) && (
                      <Typography.Text
                        type="warning"
                        style={{ fontSize: '' }}
                        strong={false}
                        disabled={false}
                        ellipsis={true}
                        __component_name="Typography.Text"
                      >
                        {
                          this.i18n(
                            'i18n-zr17woji'
                          ) /* 如更新“配置文件”内容，可能触发组件服务重启，从而影响用户使用，请谨慎操作！ */
                        }
                      </Typography.Text>
                    )}
                  </Space>
                </FormilyFormItem>
              </FormilyForm>
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
  const match = matchPath(
    { path: '/components/:page/:subPage/management-action/:action/:id' },
    location.pathname
  );
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
      sdkSwrFuncs={[]}
      render={dataProps => (
        <ComponentsActions$$Page {...dataProps} self={self} appHelper={appHelper} />
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
