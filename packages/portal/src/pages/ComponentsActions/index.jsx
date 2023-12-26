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
      cluster: undefined,
      component: undefined,
      creating: false,
      data: undefined,
      images: undefined,
      isCreate: true,
      name: undefined,
      tenants: [],
      valuesYaml: '',
      yamlLoading: false,
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

  getCluster() {
    const cluster = this.appHelper?.history?.query?.cluster;
    return cluster;
  }

  getClusterInfo() {
    return this.state.cluster;
  }

  getReademeDetailPath() {
    return `/component-store/components/market/subPage/management-detail/detail/${
      this.props.appHelper?.match?.params?.id
    }?cluster=${this.getCluster()}&tab=READEME`;
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
        label: `${item.image}`,
        value: item.id,
      })),
    });
  }

  handleYamlChange(v) {
    this.setState({
      valuesYaml: v || '',
    });
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
            v?.subscription?.schedule &&
            this.utils.dayjs(
              `2022-01-01 ${this.utils.cronChangeToDate(v?.subscription?.schedule)}:00`
            ),
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

  async loadCluster() {
    const res = await this.props.appHelper?.utils?.bffSdk?.getCluster({
      name: this.getCluster(),
    });
    const cluster = res?.cluster;
    this.setState({
      cluster,
    });
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

  onCancel(event) {
    this.history.go(-1);
  }

  onEditorLoad(editor) {
    this.setState({
      editor,
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
          const image = this.state.images?.find(i => i.id === item.image);
          return {
            id: item.image,
            registry: item.newRegistry,
            path: item.newPath,
            name: item.newName,
            tag: item.newTag,
            matched: image?.matched,
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

  setFormValues(values) {
    if (!this.form()) {
      setTimeout(() => {
        this.setFormValues(values);
      }, 200);
      return;
    }
    this.form().setValues(values);
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
          (item, index) => item.image === currItem?.image && curIndex !== index
        )
      ) {
        return this.i18n('i18n-9al8mu54');
      }
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
        <Row __component_name="Row" wrap={true}>
          <Col __component_name="Col" span={24}>
            <Space __component_name="Space" align="center" direction="horizontal">
              <Button.Back
                __component_name="Button.Back"
                name={this.i18n('i18n-86so9ago') /* 返回 */}
                title={__$$eval(() =>
                  this.props.appHelper?.match?.params?.action === this.i18n('i18n-eo4gqliw')
                    ? '组件安装'
                    : this.i18n('i18n-2ugh3v5e')
                )}
                type="primary"
              />
            </Space>
            {!!__$$eval(() => this.props.appHelper?.match?.params?.action === 'install') && (
              <Tag
                __component_name="Tag"
                closable={false}
                color="rgba(0,0,0,0.65)"
                style={{
                  borderRadius: '0',
                  marginLeft: '16px',
                  marginRight: '0px',
                  marginTop: '-5px',
                  position: 'relative',
                }}
              >
                {this.i18n('i18n-yfkq2xqq') /* 集群 */}
              </Tag>
            )}
            {!!__$$eval(() => this.props.appHelper?.match?.params?.action === 'install') && (
              <Tag
                __component_name="Tag"
                closable={false}
                color="#ffffff"
                style={{
                  borderRadius: '0',
                  color: 'rgba(0,0,0,0.8)',
                  marginTop: '-5px',
                  position: 'relative',
                }}
              >
                {__$$eval(() => this.getClusterInfo()?.fullName || '-')}
              </Tag>
            )}
          </Col>
          <Col __component_name="Col" span={24}>
            <Card
              __component_name="Card"
              actions={[]}
              bordered={false}
              hoverable={false}
              loading={false}
              size="default"
              type="default"
            >
              <Alert
                __component_name="Alert"
                icon={
                  <TenxIconTips
                    __component_name="TenxIconTips"
                    color="#7ed321"
                    size={14}
                    style={{ marginRight: '8px' }}
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
                      {this.i18n('i18n-agx7sv3d') /* 阅读组件安装说明，助您快速部署体验 */}
                    </Typography.Text>
                    <UnifiedLink
                      __component_name="UnifiedLink"
                      target="_blank"
                      to={__$$eval(() => this.getReademeDetailPath())}
                    >
                      {this.i18n('i18n-6yyi2qu9') /* 安装说明>> */}
                    </UnifiedLink>
                  </Space>
                }
                showIcon={true}
                style={{ marginBottom: '20px' }}
                type="success"
              />
              <FormilyForm
                __component_name="FormilyForm"
                componentProps={{
                  colon: false,
                  labelAlign: 'left',
                  labelCol: 3,
                  layout: 'horizontal',
                  wrapperCol: 20,
                }}
                formHelper={{ autoFocus: true }}
                ref={this._refsManager.linkRef('formily_create')}
              >
                <FormilyInput
                  __component_name="FormilyInput"
                  componentProps={{
                    'x-component-props': {
                      placeholder: this.i18n('i18n-5jsxr8i5') /* 请输入部署名称 */,
                    },
                  }}
                  decoratorProps={{
                    'x-decorator-props': {
                      fullness: false,
                      labelEllipsis: true,
                      labelWidth: '',
                      wrapperWidth: '',
                    },
                  }}
                  fieldProps={{
                    name: 'releaseName',
                    required: true,
                    title: this.i18n('i18n-wwsgwkdl') /* 部署名称 */,
                    'x-pattern': __$$eval(() =>
                      this.props.appHelper?.match?.params?.action === 'install'
                        ? 'editable'
                        : 'disabled'
                    ),
                    'x-validator': [
                      {
                        children: '未知',
                        id: 'disabled',
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
                        type: 'disabled',
                      },
                      {
                        children: '未知',
                        id: 'disabled',
                        message: '',
                        triggerType: 'onBlur',
                        type: 'disabled',
                        validator: function () {
                          return this.validatorName.apply(
                            this,
                            Array.prototype.slice.call(arguments).concat([])
                          );
                        }.bind(this),
                      },
                    ],
                  }}
                  style={{ width: '680px' }}
                />
                <FormilyInput
                  __component_name="FormilyInput"
                  componentProps={{
                    'x-component-props': {
                      placeholder: this.i18n('i18n-ppoohtxl') /* 请输入组件名称 */,
                    },
                  }}
                  decoratorProps={{ 'x-decorator-props': { labelEllipsis: true } }}
                  fieldProps={{
                    name: 'chartName',
                    required: true,
                    title: this.i18n('i18n-cuf6u4di') /* 组件名称 */,
                    'x-pattern': 'disabled',
                    'x-validator': [],
                  }}
                  style={{ width: '680px' }}
                />
                <FormilyInput
                  __component_name="FormilyInput"
                  componentProps={{
                    'x-component-props': {
                      placeholder: this.i18n('i18n-5ndvc0c5') /* 请输入组件仓库名称 */,
                    },
                  }}
                  decoratorProps={{ 'x-decorator-props': { labelEllipsis: true } }}
                  fieldProps={{
                    name: 'repository',
                    required: true,
                    title: this.i18n('i18n-1po87kgw') /* 组件仓库 */,
                    'x-pattern': 'disabled',
                    'x-validator': [],
                  }}
                  style={{ width: '680px' }}
                />
                <FormilyFormItem
                  __component_name="FormilyFormItem"
                  decoratorProps={{ 'x-decorator-props': { asterisk: true, labelEllipsis: false } }}
                  fieldProps={{
                    _unsafe_MixedSetter_title_select: 'SlotSetter',
                    name: 'method',
                    title: (
                      <Space
                        __component_name="Space"
                        align="center"
                        direction="horizontal"
                        size={3}
                      >
                        <Typography.Text
                          __component_name="Typography.Text"
                          disabled={false}
                          ellipsis={true}
                          strong={false}
                          style={{ fontSize: '' }}
                        >
                          {this.i18n('i18n-5u3ohmy6') /* 更新方式 */}
                        </Typography.Text>
                        <Tooltip
                          __component_name="Tooltip"
                          overlayInnerStyle={{ width: '300px' }}
                          placement="right"
                          title={
                            <Row __component_name="Row" gutter={[0, 0]} wrap={true}>
                              <Col __component_name="Col" span={24}>
                                <Typography.Text
                                  __component_name="Typography.Text"
                                  disabled={false}
                                  ellipsis={false}
                                  strong={false}
                                  style={{ color: 'white', fontSize: '' }}
                                >
                                  {
                                    this.i18n(
                                      'i18n-6lxj84mp'
                                    ) /* 手动更新，即组件有新版本时，用户手动安装新版本 */
                                  }
                                </Typography.Text>
                              </Col>
                              <Col __component_name="Col" span={24}>
                                <Typography.Text
                                  __component_name="Typography.Text"
                                  disabled={false}
                                  ellipsis={false}
                                  strong={false}
                                  style={{ color: 'white', fontSize: '' }}
                                >
                                  {
                                    this.i18n(
                                      'i18n-87myvm9c'
                                    ) /* 自动更新，即组件有新版本时，按设置自动更新 */
                                  }
                                </Typography.Text>
                              </Col>
                              <Col __component_name="Col" span={24} style={{}}>
                                <Typography.Text
                                  __component_name="Typography.Text"
                                  disabled={false}
                                  ellipsis={false}
                                  strong={false}
                                  style={{ color: 'white', fontSize: '' }}
                                >
                                  {
                                    this.i18n(
                                      'i18n-89zbhcux'
                                    ) /* 未设置时间，则立即触发更新，请谨慎选择！ */
                                  }
                                </Typography.Text>
                              </Col>
                              <Col __component_name="Col" span={24}>
                                <Typography.Text
                                  __component_name="Typography.Text"
                                  disabled={false}
                                  ellipsis={true}
                                  strong={false}
                                  style={{ color: 'white', fontSize: '' }}
                                >
                                  {
                                    this.i18n(
                                      'i18n-jmfs26ru'
                                    ) /* 选择时间后，则按设置时间主动触发更新 */
                                  }
                                </Typography.Text>
                              </Col>
                              <Col __component_name="Col" span={24}>
                                <Typography.Text
                                  __component_name="Typography.Text"
                                  disabled={false}
                                  ellipsis={true}
                                  strong={false}
                                  style={{ color: 'white', fontSize: '' }}
                                >
                                  {this.i18n('i18n-spvoti5u') /* 自动更新，同时会自动订阅此组件 */}
                                </Typography.Text>
                              </Col>
                            </Row>
                          }
                        >
                          <Container
                            __component_name="Container"
                            color="colorTextSecondary"
                            style={{ margin: '1px 0 0 2px' }}
                          >
                            <AntdIconQuestionCircleOutlined
                              __component_name="AntdIconQuestionCircleOutlined"
                              style={{ color: '' }}
                            />
                          </Container>
                        </Tooltip>
                      </Space>
                    ),
                    'x-component': 'FormilyFormItem',
                    'x-validator': [],
                  }}
                >
                  <FormilySelect
                    __component_name="FormilySelect"
                    componentProps={{
                      'x-component-props': {
                        _sdkSwrGetFunc: {},
                        allowClear: false,
                        disabled: false,
                        onChange: function () {
                          return this.handleInstallMethodChange.apply(
                            this,
                            Array.prototype.slice.call(arguments).concat([])
                          );
                        }.bind(this),
                        placeholder: this.i18n('i18n-t05r1cpz') /* 请选择更新方式 */,
                      },
                    }}
                    decoratorProps={{ 'x-decorator-props': { labelEllipsis: true } }}
                    fieldProps={{
                      _unsafe_MixedSetter_default_select: 'StringSetter',
                      _unsafe_MixedSetter_enum_select: 'ExpressionSetter',
                      default: 'manual',
                      enum: __$$eval(() => this.utils.getComponentInstallMethods(this)),
                      name: 'componentPlanInstallMethod',
                      required: true,
                      title: '',
                      'x-validator': [],
                    }}
                    style={{ width: '680px' }}
                  />
                  <FormilyTimePicker
                    __component_name="FormilyTimePicker"
                    componentProps={{
                      'x-component-props': {
                        allowClear: true,
                        disabled: false,
                        format: 'HH:mm',
                        placeholder:
                          this.i18n(
                            'i18n-daozlce9'
                          ) /* 请选择时间（每天），未设置即有新版本发布后立即更新 */,
                      },
                    }}
                    decoratorProps={{ 'x-decorator-props': { labelEllipsis: true } }}
                    fieldProps={{
                      name: 'schedule',
                      required: false,
                      title: '',
                      'x-display':
                        "{{$form.values.method?.componentPlanInstallMethod === 'auto' ? 'visible': 'hidden'}}",
                      'x-validator': [],
                    }}
                    style={{ width: '680px' }}
                  />
                </FormilyFormItem>
                <FormilySelect
                  __component_name="FormilySelect"
                  componentProps={{
                    'x-component-props': {
                      _sdkSwrGetFunc: {},
                      allowClear: false,
                      disabled:
                        "{{$form.values?.method?.componentPlanInstallMethod === 'auto' ? true : false}}",
                      onChange: function () {
                        return this.handleVersionChange.apply(
                          this,
                          Array.prototype.slice.call(arguments).concat([])
                        );
                      }.bind(this),
                      placeholder: this.i18n('i18n-lbw8wy6i') /* 请选择组件版本 */,
                    },
                  }}
                  decoratorProps={{ 'x-decorator-props': { labelEllipsis: true } }}
                  fieldProps={{
                    _unsafe_MixedSetter_enum_select: 'ArraySetter',
                    enum: [],
                    name: 'version',
                    required: true,
                    title: this.i18n('i18n-ekp8efeq') /* 组件版本 */,
                    'x-pattern': '',
                    'x-validator': [],
                  }}
                  style={{ width: '680px' }}
                />
                {!!__$$eval(() => this.props.appHelper?.match?.params?.action === 'install') && (
                  <FormilyFormItem
                    __component_name="FormilyFormItem"
                    decoratorProps={{
                      'x-decorator-props': { asterisk: true, labelEllipsis: true },
                    }}
                    fieldProps={{
                      _unsafe_MixedSetter_title_select: 'I18nSetter',
                      name: 'position',
                      title: this.i18n('i18n-l46z9szm') /* 安装位置 */,
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
                        decoratorProps={{ 'x-decorator-props': { labelEllipsis: true } }}
                        fieldProps={{
                          _unsafe_MixedSetter_enum_select: 'ArraySetter',
                          enum: [],
                          name: 'tenant',
                          required: true,
                          title: '',
                          'x-pattern': __$$eval(() =>
                            this.props.appHelper?.match?.params?.action === 'install'
                              ? 'editable'
                              : 'disabled'
                          ),
                          'x-validator': [
                            {
                              children: '未知',
                              id: 'disabled',
                              type: 'disabled',
                              validator: function () {
                                return this.validatorTenant.apply(
                                  this,
                                  Array.prototype.slice.call(arguments).concat([])
                                );
                              }.bind(this),
                            },
                          ],
                        }}
                        style={{ width: '330px' }}
                      />
                      <FormilySelect
                        __component_name="FormilySelect"
                        componentProps={{
                          'x-component-props': {
                            _sdkSwrGetFunc: {},
                            allowClear: false,
                            disabled: false,
                            placeholder: this.i18n('i18n-er0hhc9i') /* 请选择项目 */,
                          },
                        }}
                        decoratorProps={{ 'x-decorator-props': { labelEllipsis: true } }}
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
                              children: '未知',
                              id: 'disabled',
                              type: 'disabled',
                              validator: function () {
                                return this.validatorNamespace.apply(
                                  this,
                                  Array.prototype.slice.call(arguments).concat([])
                                );
                              }.bind(this),
                            },
                          ],
                        }}
                        style={{ width: '340px' }}
                      />
                    </Space>
                  </FormilyFormItem>
                )}
                {!!false && (
                  <FormilyRadio
                    __component_name="FormilyRadio"
                    componentProps={{
                      'x-component-props': {
                        _sdkSwrGetFunc: {},
                        buttonStyle: 'outline',
                        disabled: false,
                        size: 'middle',
                      },
                    }}
                    decoratorProps={{ 'x-decorator-props': { labelEllipsis: true } }}
                    fieldProps={{
                      default: 'yes',
                      enum: [
                        { label: this.i18n('i18n-ff8jkxhb') /* 是 */, value: 'yes' },
                        { label: this.i18n('i18n-9jr0zllc') /* 否 */, value: 'no' },
                      ],
                      name: 'autocreate',
                      required: true,
                      title: this.i18n('i18n-5muxxuds') /* 自动创建菜单 */,
                      'x-validator': [],
                    }}
                  />
                )}
                <Divider
                  __component_name="Divider"
                  children=""
                  content={[null]}
                  dashed={true}
                  defaultOpen={true}
                  mode="default"
                  orientation="left"
                  orientationMargin="10px"
                  style={{}}
                >
                  <Typography.Title
                    __component_name="Typography.Title"
                    bold={true}
                    bordered={false}
                    ellipsis={true}
                    level={2}
                    style={{ position: 'relative', top: '1px' }}
                  >
                    {this.i18n('i18n-9g3poyvk') /* 组件配置 */}
                  </Typography.Title>
                </Divider>
                <FormilySelect
                  __component_name="FormilySelect"
                  componentProps={{
                    'x-component-props': {
                      _sdkSwrGetFunc: {},
                      allowClear: false,
                      disabled: false,
                      placeholder: this.i18n('i18n-8cxh8m92') /* 请选择配置文件 */,
                    },
                  }}
                  decoratorProps={{ 'x-decorator-props': { labelEllipsis: true } }}
                  fieldProps={{
                    _unsafe_MixedSetter_default_select: 'StringSetter',
                    enum: [
                      {
                        children: 'values.yaml',
                        id: 'disabled',
                        type: 'disabled',
                        value: 'values.yaml',
                      },
                    ],
                    name: 'file',
                    title: this.i18n('i18n-t6iwy9l2') /* 配置文件 */,
                    'x-validator': [],
                  }}
                  style={{ width: '680px' }}
                />
                <Row __component_name="Row" wrap={false}>
                  <Col __component_name="Col" flex="" span={3} />
                  <Col __component_name="Col" flex="auto">
                    <Spin __component_name="Spin" spinning={__$$eval(() => this.state.yamlLoading)}>
                      <Editor
                        __component_name="Editor"
                        defaultValue={__$$eval(() => this.state.valuesYaml)}
                        height="300px"
                        onChange={function () {
                          return this.handleYamlChange.apply(
                            this,
                            Array.prototype.slice.call(arguments).concat([])
                          );
                        }.bind(this)}
                        onLoad={function () {
                          return this.onEditorLoad.apply(
                            this,
                            Array.prototype.slice.call(arguments).concat([])
                          );
                        }.bind(this)}
                        placeholder=""
                        style={{ marginBottom: '22px' }}
                        styleVersion="kubebb"
                        value={__$$eval(() => this.state.valuesYaml)}
                      />
                    </Spin>
                  </Col>
                </Row>
                <FormilyFormItem
                  __component_name="FormilyFormItem"
                  decoratorProps={{ 'x-decorator-props': { labelEllipsis: true } }}
                  fieldProps={{
                    _unsafe_MixedSetter_title_select: 'I18nSetter',
                    name: 'images',
                    title: this.i18n('i18n-trftxv8p') /* 镜像替换 */,
                    'x-component': 'FormilyFormItem',
                    'x-validator': [],
                  }}
                >
                  <FormilyArrayCards
                    __component_name="FormilyArrayCards"
                    decoratorProps={{ 'x-decorator-props': { labelEllipsis: true } }}
                    fieldProps={{
                      items: {
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
                        type: 'object',
                      },
                      name: 'name',
                      properties: {
                        add: {
                          title: this.i18n('i18n-1vi37ku6') /* 添加 */,
                          type: 'void',
                          'x-component': 'FormilyArrayCards.Addition',
                        },
                      },
                      type: 'array',
                      'x-validator': [],
                    }}
                  >
                    <Space
                      __component_name="Space"
                      align="center"
                      direction="horizontal"
                      size="large"
                    >
                      <Space
                        __component_name="Space"
                        align="center"
                        direction="horizontal"
                        style={{ alignItems: 'flex-start', display: 'flex' }}
                      >
                        <FormilySelect
                          __component_name="FormilySelect"
                          componentProps={{
                            'x-component-props': {
                              _sdkSwrGetFunc: {},
                              allowClear: false,
                              disabled: false,
                              placeholder: this.i18n('i18n-47o9s8dw') /* 选择已有镜像 */,
                            },
                          }}
                          decoratorProps={{ 'x-decorator-props': { labelEllipsis: true } }}
                          fieldProps={{
                            _unsafe_MixedSetter_enum_select: 'ExpressionSetter',
                            enum: '{{ $form?.values?.imagesNames|| []}}',
                            name: 'image',
                            title: '',
                            'x-validator': [
                              {
                                children: '未知',
                                id: 'disabled',
                                type: 'disabled',
                                validator: function () {
                                  return this.validatorImagesName.apply(
                                    this,
                                    Array.prototype.slice.call(arguments).concat([])
                                  );
                                }.bind(this),
                              },
                            ],
                          }}
                          style={{ width: '170px' }}
                        />
                        <Typography.Text
                          __component_name="Typography.Text"
                          disabled={false}
                          ellipsis={true}
                          strong={false}
                          style={{ fontSize: '' }}
                        >
                          {this.i18n('i18n-xeckog8e') /* 替换为 */}
                        </Typography.Text>
                      </Space>
                      <Space
                        __component_name="Space"
                        align="center"
                        direction="horizontal"
                        style={{ alignItems: 'flex-start', display: 'flex' }}
                      >
                        <FormilyInput
                          __component_name="FormilyInput"
                          componentProps={{
                            'x-component-props': {
                              placeholder: this.i18n('i18n-0oa9ae8g') /* 新域名 */,
                            },
                          }}
                          decoratorProps={{ 'x-decorator-props': { labelEllipsis: true } }}
                          fieldProps={{
                            name: 'newRegistry',
                            title: '',
                            'x-pattern': 'editable',
                            'x-validator': [],
                          }}
                          style={{ width: '170px' }}
                        />
                        <FormilyInput
                          __component_name="FormilyInput"
                          componentProps={{
                            'x-component-props': {
                              placeholder: this.i18n('i18n-v8m8fg5l') /* 新仓库组 */,
                            },
                          }}
                          decoratorProps={{ 'x-decorator-props': { labelEllipsis: true } }}
                          fieldProps={{
                            name: 'newPath',
                            title: '',
                            'x-pattern': 'editable',
                            'x-validator': [],
                          }}
                          style={{ width: '170px' }}
                        />
                        <FormilyInput
                          __component_name="FormilyInput"
                          componentProps={{
                            'x-component-props': {
                              placeholder: this.i18n('i18n-1gb2xaxt') /* 新镜像名称(非必填) */,
                            },
                          }}
                          decoratorProps={{ 'x-decorator-props': { labelEllipsis: true } }}
                          fieldProps={{ name: 'newName', title: '', 'x-validator': [] }}
                          style={{ width: '170px' }}
                        />
                        <Typography.Text
                          __component_name="Typography.Text"
                          disabled={false}
                          ellipsis={true}
                          strong={false}
                          style={{ fontSize: '' }}
                        >
                          :
                        </Typography.Text>
                        <FormilyInput
                          __component_name="FormilyInput"
                          componentProps={{
                            'x-component-props': {
                              placeholder: this.i18n('i18n-9u5a4f3f') /* 新tag/新digest(非必填) */,
                            },
                          }}
                          decoratorProps={{ 'x-decorator-props': { labelEllipsis: true } }}
                          fieldProps={{ name: 'newTag', title: '', 'x-validator': [] }}
                          style={{ width: '170px' }}
                        />
                      </Space>
                    </Space>
                  </FormilyArrayCards>
                </FormilyFormItem>
                <Divider
                  __component_name="Divider"
                  dashed={false}
                  defaultOpen={false}
                  mode="line"
                  style={{ marginLeft: '-24px', width: 'calc(100% + 48px)' }}
                />
                <FormilyFormItem
                  __component_name="FormilyFormItem"
                  componentProps={{ 'x-component-props': {} }}
                  fieldProps={{
                    _unsafe_MixedSetter_title_select: 'SlotSetter',
                    name: 'FormilyFormItem15',
                    title: (
                      <Row __component_name="Row" style={{}} wrap={true}>
                        <Col __component_name="Col" span={24} />
                      </Row>
                    ),
                    'x-component': 'FormilyFormItem',
                    'x-validator': [],
                  }}
                >
                  <Space __component_name="Space" align="center" direction="horizontal">
                    <Button
                      __component_name="Button"
                      block={false}
                      danger={false}
                      disabled={false}
                      ghost={false}
                      onClick={function () {
                        return this.onCancel.apply(
                          this,
                          Array.prototype.slice.call(arguments).concat([])
                        );
                      }.bind(this)}
                      shape="default"
                    >
                      {this.i18n('i18n-46k1aoak') /* 取消 */}
                    </Button>
                    <Button
                      __component_name="Button"
                      block={false}
                      danger={false}
                      disabled={false}
                      ghost={false}
                      loading={__$$eval(() => this.state.creating)}
                      onClick={function () {
                        return this.onSubmit.apply(
                          this,
                          Array.prototype.slice.call(arguments).concat([])
                        );
                      }.bind(this)}
                      shape="default"
                      type="primary"
                    >
                      {this.i18n('i18n-mgpcpuj5') /* 确定 */}
                    </Button>
                    {!!__$$eval(
                      () => this.props.appHelper?.match?.params?.action !== 'install'
                    ) && (
                      <Typography.Text
                        __component_name="Typography.Text"
                        disabled={false}
                        ellipsis={true}
                        strong={false}
                        style={{ fontSize: '' }}
                        type="warning"
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

const PageWrapper = (props = {}) => {
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
      sdkSwrFuncs={[]}
      render={dataProps => (
        <ComponentsActions$$Page {...props} {...dataProps} self={self} appHelper={appHelper} />
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
