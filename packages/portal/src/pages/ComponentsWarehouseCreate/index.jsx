// 注意: 出码引擎注入的临时变量默认都以 "__$$" 开头，禁止在搭建的代码中直接访问。
// 例外：react 框架的导出名和各种组件名除外。
import React from 'react';

import {
  Button,
  Card,
  Col,
  Container,
  Divider,
  FormilyArrayCards,
  FormilyArrayTable,
  FormilyCheckbox,
  FormilyForm,
  FormilyFormItem,
  FormilyInput,
  FormilyNumberPicker,
  FormilyPassword,
  FormilySelect,
  FormilySwitch,
  FormilyUpload,
  Page,
  Row,
  Space,
  Tag,
  Tooltip,
  Typography,
} from '@tenx-ui/materials';

import { AntdIconQuestionCircleOutlined, AntdIconUploadOutlined } from '@tenx-ui/icon-materials';

import { getUnifiedHistory } from '@tenx-ui/utils/es/UnifiedLink/index.prod';
import { matchPath, useLocation } from '@umijs/max';
import qs from 'query-string';
import { DataProvider } from 'shared-components';

import utils, { RefsManager } from '../../utils/__utils';

import * as __$$i18n from '../../i18n';

import __$$constants from '../../__constants';

import './index.css';

class ComponentsWarehouseCreate$$Page extends React.Component {
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
      creating: false,
      hasRatingDeployed: false,
      isCreate: true,
      name: undefined,
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

  async getRatingStatus() {
    try {
      const res = await this.props.appHelper?.utils?.bff?.getRatingDeploymentStatus({
        namespace: undefined,
        cluster: this.getCluster(),
      });
      this.setState({
        hasRatingDeployed: !!res?.ratingDeploymentStatus,
      });
    } catch (e) {}
  }

  initCreate() {
    if (!this.form()) {
      setTimeout(() => {
        this.initCreate();
      }, 200);
      return;
    }
    this.form().setValues({
      // repositoryType: 'Git',
      // insecure: ['true'],
      filter: {
        value: [],
      },
      imageOverride: {
        value: [],
      },
      pullStategy: {
        intervalSeconds: 120,
        retry: 1,
        timeoutSeconds: 60,
      },
    });
    this.initDisabled();
  }

  initDisabled() {
    if (!this.form()) {
      setTimeout(() => {
        this.initDisabled();
      }, 200);
      return;
    }
    const formGraph = this.form().getFormGraph();
    Object.keys(formGraph || {}).forEach(key => {
      const pathPre = key.slice(0, key.indexOf('.operation'));
      if (key.endsWith('.operation') && formGraph[key].value === 'ignore_all') {
        this.form().setFormGraph({
          [pathPre + '.regexp']: {
            pattern: 'disabled',
          },
          [pathPre + '.versionConstraint']: {
            pattern: 'disabled',
          },
          [pathPre + '.versions']: {
            pattern: 'disabled',
          },
        });
      }
    });
  }

  async initEdit() {
    try {
      const res = await this.props?.appHelper?.utils?.bff?.getRepository({
        name: this.state.name,
        cluster: this.getCluster(),
      });
      const v = res?.repository || {};
      this.setState({
        data: v,
      });
      this.initForms(v);
    } catch (e) {}
  }

  initForms(v) {
    if (this.form() && !this.state.isCreate) {
      this.form().setValues({
        name: v.name,
        url: v.url,
        // repositoryType: v.repositoryType,
        insecure: v.insecure ? ['true'] : [],
        info: {
          auth: v.username && v.password ? ['true'] : [],
        },
        username: v.username && this.utils.decodeBase64(v.username),
        password: v.password && this.utils.decodeBase64(v.password),
        pullStategy: v.pullStategy,
        filter: {
          value: v.filter?.map(item => ({
            ...item,
            keepDeprecated: item.keepDeprecated ? 'true' : 'false',
            versions: item.versions?.[0],
          })),
        },
        imageOverride: {
          value: v.imageOverride,
        },
        enableRating: !!v.enableRating,
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

  onCancel(event) {
    this.history.go(-1);
  }

  onSubmit(event) {
    const { isCreate, name } = this.state;
    const form = this.form();
    form.submit(async v => {
      this.setState({
        creating: true,
      });
      const file = v?.cadata?.fileList?.[0];
      // this.utils.readFile(file, async (fileInfo) => {
      const params = {
        name: v.name,
        url: v.url,
        // repositoryType: v.repositoryType,
        insecure: v?.insecure?.includes('true'),
        cadata: v?.cadata?.fileList?.[0]?.originFileObj,
        certdata: v?.certdata?.fileList?.[0]?.originFileObj,
        keydata: v?.keydata?.fileList?.[0]?.originFileObj,
        username: v.info?.auth?.includes('true') ? this.utils.encodeBase64(v.username) : undefined,
        password: v.info?.auth?.includes('true') ? this.utils.encodeBase64(v.password) : undefined,
        pullStategy: v.pullStategy,
        filter: v.filter?.value?.map(item => ({
          ...item,
          keepDeprecated: item.keepDeprecated === 'true',
          versions: item.versions && [item.versions],
        })),
        imageOverride: v.imageOverride?.value,
        enableRating: !!v.enableRating,
      };
      if (!isCreate) {
        delete params.repositoryType;
        delete params.url;
        delete params.name;
      }
      const api = {
        create: {
          name: 'createRepository',
          params: {
            repository: params,
            cluster: this.getCluster(),
          },
          successMessage: 'i18n-m2mn87ml',
          faildMessage: 'i18n-tvl20dh9',
        },
        update: {
          name: 'updateRepository',
          params: {
            cluster: this.getCluster(),
            repository: params,
            name,
          },
          successMessage: 'i18n-xk0w1n7g',
          faildMessage: 'i18n-0x19rraf',
        },
      }[isCreate ? 'create' : 'update'];
      try {
        const res = await this.props.appHelper.utils.bff[api.name](api.params, {
          'Apollo-Require-Preflight': true,
        });
        this.utils.notification.success({
          message: this.i18n(api.successMessage),
        });
        this.onCancel();
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
      // })
    });
  }

  async validatorComponentName(value, ...payload) {
    const values = this.form()?.values;
    try {
      if (
        value &&
        values?.filter?.value?.some(
          (item, index) => item.name === value && payload?.[1]?.field?.index !== index
        )
      ) {
        return this.i18n('i18n-ph9t7b7n');
      }
    } catch (e) {}
  }

  async validatorDisabled(value, ...payload) {
    const pathPre = payload?.[1]?.field?.props?.basePath?.entire;
    if (value === 'ignore_all') {
      this.form().setFormGraph({
        [pathPre + '.regexp']: {
          pattern: 'disabled',
        },
        [pathPre + '.versionConstraint']: {
          pattern: 'disabled',
        },
        [pathPre + '.versions']: {
          pattern: 'disabled',
        },
      });
    } else {
      this.form().setFormGraph({
        [pathPre + '.regexp']: {
          pattern: 'editable',
        },
        [pathPre + '.versionConstraint']: {
          pattern: 'editable',
        },
        [pathPre + '.versions']: {
          pattern: 'editable',
        },
      });
    }
  }

  validatorDomain(value) {
    if (value && !this.utils.isIP(value) && !/^([a-zA-Z0-9-]+(\.|\-))+[a-zA-Z]{2,}$/.test(value)) {
      return this.i18n('i18n-gyegeqvt');
    }
  }

  async validatorDomainName(value, ...payload) {
    const values = this.form()?.values;
    const curIndex = payload?.[1]?.field?.index;
    const currItem = values?.imageOverride?.value?.[curIndex];
    if (this.validatorDomain(value)) {
      return this.validatorDomain(value);
    }
    try {
      if (
        value &&
        values?.imageOverride?.value?.some(
          (item, index) =>
            item.registry === currItem?.registry &&
            item.path === currItem?.path &&
            curIndex !== index
        )
      ) {
        return this.i18n('i18n-9al8mu54');
      }
    } catch (e) {}
  }

  validatorFile(value) {
    if (!value && !this.state.data?.cadata) {
      return this.i18n('i18n-aa3ink0n');
    }
    // // k
    // if (value?.file.size > 5*1000*) {
    //   return '文件不能大于 5M'
    // }
  }

  async validatorName(value) {
    try {
      if (value && this.state.isCreate) {
        const res = await this.props?.appHelper?.utils?.bff?.getRepository({
          name: value,
        });
        if (res?.repository?.name) {
          return this.i18n('i18n-52vob0jn');
        }
      }
    } catch (e) {}
  }

  async validatorNameCharacter(value) {
    if (value && (value.includes('.-') || value.includes('-.'))) {
      return this.i18n('i18n-dofmyljq');
    }
  }

  validatorRepo(value) {
    if (value && !/^([a-z0-9]{1}[-a-z0-9.]{1,251})[a-z0-9]{1}$/.test(value)) {
      return this.i18n('i18n-dzffs2mw');
    }
  }

  async validatorRepoName(value, ...payload) {
    const values = this.form()?.values;
    const curIndex = payload?.[1]?.field?.index;
    const currItem = values?.imageOverride?.value?.[curIndex];
    if (this.validatorRepo(value)) {
      return this.validatorRepo(value);
    }
    try {
      if (
        value &&
        values?.imageOverride?.value?.some(
          (item, index) =>
            item.registry === currItem?.registry &&
            item.path === currItem?.path &&
            curIndex !== index
        )
      ) {
        return this.i18n('i18n-9al8mu54');
      }
    } catch (e) {}
  }

  async validatorUrl(value) {
    const URL_REG_EXP =
      /^https?:\/\/(([a-zA-Z0-9_-])+(\.)?)*(:\d+)?(\/((\.)?(\?)?=?&?[a-zA-Z0-9_-](\?)?)*)*$/i;
    if (value && !URL_REG_EXP.test(value)) {
      return this.i18n('i18n-q9gsf3z5');
    }
    if (value && value.endsWith('/')) {
      return this.i18n('i18n-q9gsf3z5');
    }
  }

  componentDidMount() {
    this.getRatingStatus();
    this.loadCluster();
    const isCreate = this.props.appHelper?.match?.params?.id === 'create';
    this.setState(
      {
        isCreate,
        name: this.props.appHelper?.match?.params?.id,
      },
      () => {
        if (isCreate) {
          this.initCreate();
        } else {
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
                  this.props.appHelper?.match?.params?.id === 'create'
                    ? this.i18n('i18n-qwjrzcj4')
                    : this.i18n('i18n-91t6vkff')
                )}
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
              cover=""
              hoverable={false}
              loading={false}
              size="default"
              type="inner"
            >
              <FormilyForm
                __component_name="FormilyForm"
                componentProps={{
                  colon: false,
                  labelAlign: 'left',
                  labelCol: 4,
                  labelWidth: '145px',
                  layout: 'horizontal',
                  wrapperCol: 20,
                  wrapperWidth: '680px',
                }}
                formHelper={{ autoFocus: true }}
                ref={this._refsManager.linkRef('formily_create')}
              >
                <FormilyInput
                  __component_name="FormilyInput"
                  componentProps={{
                    'x-component-props': {
                      placeholder: this.i18n('i18n-psh5pyle') /* 请填写组件仓库名称 */,
                    },
                  }}
                  decoratorProps={{
                    'x-decorator-props': { asterisk: false, labelEllipsis: true, wrapperCol: 10 },
                  }}
                  fieldProps={{
                    name: 'name',
                    required: true,
                    title: this.i18n('i18n-x25agmsc') /* 名称 */,
                    'x-pattern': __$$eval(() =>
                      this.props.appHelper?.match?.params?.id !== 'create' ? 'disabled' : 'editable'
                    ),
                    'x-validator': [
                      {
                        children: '未知',
                        id: 'disabled',
                        message:
                          this.i18n(
                            'i18n-dzffs2mw'
                          ) /* 由3~253个小写字母、数字、中划线“-”或点“.”组成，并以字母、数字开头或结尾 */,
                        pattern: __$$eval(() =>
                          this.utils.getNameReg({
                            max: 253,
                          })
                        ),
                        required: false,
                        type: 'disabled',
                        whitespace: false,
                      },
                      {
                        children: '未知',
                        id: 'disabled',
                        message: this.i18n('i18n-dofmyljq') /* “.”  和 “-” 不能连用 */,
                        type: 'disabled',
                        validator: function () {
                          return this.validatorNameCharacter.apply(
                            this,
                            Array.prototype.slice.call(arguments).concat([])
                          );
                        }.bind(this),
                      },
                      {
                        children: '未知',
                        id: 'disabled',
                        message: this.i18n('i18n-52vob0jn') /* 仓库名称重复 */,
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
                />
                <FormilyInput
                  __component_name="FormilyInput"
                  componentProps={{
                    'x-component-props': {
                      placeholder:
                        this.i18n('i18n-1lkuumnu') /* 请填写组件仓库地址，例http://ip(host):port */,
                    },
                  }}
                  decoratorProps={{ 'x-decorator-props': { asterisk: true, labelEllipsis: true } }}
                  fieldProps={{
                    name: 'url',
                    required: true,
                    title: this.i18n('i18n-iqh7qzhi') /* URL */,
                    'x-pattern': __$$eval(() =>
                      this.props.appHelper?.match?.params?.id !== 'create' ? 'disabled' : 'editable'
                    ),
                    'x-validator': [
                      {
                        children: '未知',
                        id: 'disabled',
                        message: this.i18n('i18n-q9gsf3z5') /* URL 格式不正确 */,
                        type: 'disabled',
                        validator: function () {
                          return this.validatorUrl.apply(
                            this,
                            Array.prototype.slice.call(arguments).concat([])
                          );
                        }.bind(this),
                      },
                    ],
                  }}
                  ref={this._refsManager.linkRef('formilyinput-24ff12d0')}
                />
                {!!false && (
                  <FormilySelect
                    __component_name="FormilySelect"
                    componentProps={{
                      'x-component-props': {
                        _sdkSwrGetFunc: {},
                        allowClear: false,
                        disabled: __$$eval(
                          () => this.props.appHelper?.match?.params?.id !== 'create'
                        ),
                        placeholder: this.i18n('i18n-n0h4rmtn') /* 请选择组件仓库类型 */,
                      },
                    }}
                    decoratorProps={{ 'x-decorator-props': { asterisk: false } }}
                    fieldProps={{
                      default: '',
                      enum: [
                        {
                          children: '',
                          id: 'disabled',
                          label: 'Git',
                          type: 'disabled',
                          value: 'Git',
                        },
                        {
                          children: '',
                          id: 'disabled',
                          label: 'Chart Museum',
                          type: 'disabled',
                          value: 'ChartMuseum',
                        },
                      ],
                      name: 'repositoryType',
                      required: true,
                      title: this.i18n('i18n-gyax19ni') /* 类型 */,
                      'x-pattern': __$$eval(() =>
                        this.props.appHelper?.match?.params?.id !== 'create'
                          ? 'disabled'
                          : 'editable'
                      ),
                      'x-validator': [],
                    }}
                  />
                )}
                <FormilyCheckbox
                  __component_name="FormilyCheckbox"
                  componentProps={{ 'x-component-props': { _sdkSwrGetFunc: {} } }}
                  fieldProps={{
                    enum: [{ label: this.i18n('i18n-pe8t9yro') /* https 验证 */, value: 'true' }],
                    name: 'insecure',
                    title: this.i18n('i18n-utwwqntm') /* 安全信息 */,
                    'x-validator': [],
                  }}
                  ref={this._refsManager.linkRef('formilycheckbox-cc84e65a')}
                  style={{}}
                />
                <FormilyUpload
                  __component_name="FormilyUpload"
                  componentProps={{
                    'x-component-props': {
                      accept: '.der,.cer,.pem,.crt,.key,.p7b,.p7c,.pfx',
                      beforeUpload: function () {
                        return this.beforeUpload.apply(
                          this,
                          Array.prototype.slice.call(arguments).concat([])
                        );
                      }.bind(this),
                      maxCount: 1,
                      uploadListInline: true,
                    },
                  }}
                  decoratorProps={{
                    'x-decorator-props': {
                      asterisk: true,
                      colon: false,
                      labelAlign: 'left',
                      labelWidth: '145px',
                    },
                  }}
                  fieldProps={{
                    _unsafe_MixedSetter_title_select: 'SlotSetter',
                    name: 'cadata',
                    title: (
                      <Typography.Text
                        __component_name="Typography.Text"
                        disabled={false}
                        ellipsis={true}
                        strong={false}
                        style={{ fontSize: '', position: 'relative', top: '2px' }}
                        type="colorTextSecondary"
                      >
                        {this.i18n('i18n-r8c2xx03') /* 根证书 */}
                      </Typography.Text>
                    ),
                    'x-component': 'FormilyUpload',
                    'x-display':
                      "{{$form.values?.insecure?.includes('true') ? 'visible': 'hidden'}}",
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
                  ref={this._refsManager.linkRef('formilyupload-666ef891')}
                  style={{}}
                >
                  <Button
                    __component_name="Button"
                    block={false}
                    danger={false}
                    disabled={false}
                    ghost={true}
                    icon={<AntdIconUploadOutlined __component_name="AntdIconUploadOutlined" />}
                    ref={this._refsManager.linkRef('button-15001b03')}
                    shape="default"
                    style={{}}
                    type="primary"
                  >
                    {this.i18n('i18n-b8lgc3ot') /* 上传 */}
                  </Button>
                </FormilyUpload>
                <FormilyUpload
                  __component_name="FormilyUpload"
                  componentProps={{
                    'x-component-props': {
                      accept: '.der,.cer,.pem,.crt,.key,.p7b,.p7c,.pfx',
                      beforeUpload: function () {
                        return this.beforeUpload.apply(
                          this,
                          Array.prototype.slice.call(arguments).concat([])
                        );
                      }.bind(this),
                      maxCount: 1,
                      uploadListInline: true,
                    },
                  }}
                  decoratorProps={{
                    'x-decorator-props': {
                      asterisk: false,
                      colon: false,
                      labelAlign: 'left',
                      labelWidth: '145px',
                    },
                  }}
                  fieldProps={{
                    _unsafe_MixedSetter_title_select: 'SlotSetter',
                    name: 'certdata',
                    title: (
                      <Typography.Text
                        __component_name="Typography.Text"
                        disabled={false}
                        ellipsis={true}
                        strong={false}
                        style={{ fontSize: '', position: 'relative', top: '2px' }}
                        type="colorTextSecondary"
                      >
                        {this.i18n('i18n-dx6dp5fl') /* 客户端证书 */}
                      </Typography.Text>
                    ),
                    'x-component': 'FormilyUpload',
                    'x-display':
                      "{{$form.values?.insecure?.includes('true') ? 'visible': 'hidden'}}",
                    'x-validator': [],
                  }}
                  ref={this._refsManager.linkRef('formilyupload-666ef891')}
                  style={{}}
                >
                  <Button
                    __component_name="Button"
                    block={false}
                    danger={false}
                    disabled={false}
                    ghost={true}
                    icon={<AntdIconUploadOutlined __component_name="AntdIconUploadOutlined" />}
                    ref={this._refsManager.linkRef('button-15001b03')}
                    shape="default"
                    style={{}}
                    type="primary"
                  >
                    {this.i18n('i18n-b8lgc3ot') /* 上传 */}
                  </Button>
                </FormilyUpload>
                <FormilyUpload
                  __component_name="FormilyUpload"
                  componentProps={{
                    'x-component-props': {
                      accept: '.der,.cer,.pem,.crt,.key,.p7b,.p7c,.pfx',
                      beforeUpload: function () {
                        return this.beforeUpload.apply(
                          this,
                          Array.prototype.slice.call(arguments).concat([])
                        );
                      }.bind(this),
                      maxCount: 1,
                      uploadListInline: true,
                    },
                  }}
                  decoratorProps={{
                    'x-decorator-props': {
                      asterisk: false,
                      colon: false,
                      labelAlign: 'left',
                      labelWidth: '145px',
                    },
                  }}
                  fieldProps={{
                    _unsafe_MixedSetter_title_select: 'SlotSetter',
                    name: 'keydata',
                    title: (
                      <Typography.Text
                        __component_name="Typography.Text"
                        disabled={false}
                        ellipsis={true}
                        strong={false}
                        style={{ fontSize: '', position: 'relative', top: '2px' }}
                        type="colorTextSecondary"
                      >
                        {this.i18n('i18n-4g9ld3fm') /* 客户端私钥 */}
                      </Typography.Text>
                    ),
                    'x-component': 'FormilyUpload',
                    'x-display':
                      "{{$form.values?.insecure?.includes('true') ? 'visible': 'hidden'}}",
                    'x-validator': [],
                  }}
                  ref={this._refsManager.linkRef('formilyupload-666ef891')}
                  style={{}}
                >
                  <Button
                    __component_name="Button"
                    block={false}
                    danger={false}
                    disabled={false}
                    ghost={true}
                    icon={<AntdIconUploadOutlined __component_name="AntdIconUploadOutlined" />}
                    ref={this._refsManager.linkRef('button-15001b03')}
                    shape="default"
                    style={{}}
                    type="primary"
                  >
                    {this.i18n('i18n-b8lgc3ot') /* 上传 */}
                  </Button>
                </FormilyUpload>
                <FormilyFormItem
                  __component_name="FormilyFormItem"
                  componentProps={{ 'x-component-props': {} }}
                  fieldProps={{
                    name: 'info',
                    title: this.i18n('i18n-cau0sbxf') /*     */,
                    'x-component': 'FormilyFormItem',
                    'x-validator': [],
                  }}
                  ref={this._refsManager.linkRef('formilyformitem-87c69db9')}
                  style={{}}
                >
                  <FormilyCheckbox
                    __component_name="FormilyCheckbox"
                    componentProps={{ 'x-component-props': { _sdkSwrGetFunc: {} } }}
                    fieldProps={{
                      enum: [{ label: this.i18n('i18n-iqgm02qd') /* 安全认证 */, value: 'true' }],
                      name: 'auth',
                      title: '',
                      'x-validator': [],
                    }}
                  />
                  {!!false && (
                    <FormilyInput
                      __component_name="FormilyInput"
                      componentProps={{
                        'x-component-props': {
                          placeholder: this.i18n('i18n-ct1um5i8') /* 请填写认证用户名 */,
                        },
                      }}
                      decoratorProps={{
                        'x-decorator-props': {
                          colon: false,
                          labelAlign: 'left',
                          labelWidth: '80px',
                        },
                      }}
                      fieldProps={{
                        name: 'username',
                        required: true,
                        title: this.i18n('i18n-h2dtugcf') /* 用户名 */,
                        'x-validator': [],
                      }}
                      ref={this._refsManager.linkRef('formilyinput-87f9c4b3')}
                    />
                  )}
                  {!!false && (
                    <FormilyPassword
                      __component_name="FormilyPassword"
                      componentProps={{
                        'x-component-props': {
                          placeholder: this.i18n('i18n-8hbax8oq') /* 请填写密码 */,
                        },
                      }}
                      decoratorProps={{
                        'x-decorator-props': {
                          colon: false,
                          labelAlign: 'left',
                          labelWidth: '80px',
                          wrapperAlign: 'left',
                        },
                      }}
                      fieldProps={{
                        name: 'Password',
                        required: true,
                        title: this.i18n('i18n-yufusyzl') /* 密码 */,
                        'x-validator': [],
                      }}
                      ref={this._refsManager.linkRef('formilypassword-87a8b44b')}
                    />
                  )}
                </FormilyFormItem>
                <FormilyInput
                  __component_name="FormilyInput"
                  componentProps={{
                    'x-component-props': {
                      placeholder: this.i18n('i18n-ct1um5i8') /* 请填写认证用户名 */,
                    },
                  }}
                  decoratorProps={{ 'x-decorator-props': { asterisk: true } }}
                  fieldProps={{
                    _unsafe_MixedSetter_title_select: 'SlotSetter',
                    enum: [],
                    name: 'username',
                    required: true,
                    title: (
                      <Typography.Text
                        __component_name="Typography.Text"
                        disabled={false}
                        ellipsis={true}
                        strong={false}
                        style={{ fontSize: '', position: 'relative', top: '2px' }}
                        type="colorTextSecondary"
                      >
                        {this.i18n('i18n-h2dtugcf') /* 用户名 */}
                      </Typography.Text>
                    ),
                    'x-display':
                      "{{$form.values.info?.auth?.includes('true') ? 'visible': 'hidden'}}",
                    'x-validator': [
                      {
                        children: '未知',
                        id: 'disabled',
                        message: this.i18n('i18n-ct1um5i8') /* 请填写认证用户名 */,
                        required: true,
                        type: 'disabled',
                      },
                    ],
                  }}
                  ref={this._refsManager.linkRef('formilyinput-245edefa')}
                  style={{}}
                />
                <FormilyPassword
                  __component_name="FormilyPassword"
                  componentProps={{
                    'x-component-props': {
                      placeholder: this.i18n('i18n-8hbax8oq') /* 请填写密码 */,
                    },
                  }}
                  decoratorProps={{
                    'x-decorator-props': {
                      asterisk: true,
                      colon: false,
                      labelAlign: 'left',
                      labelEllipsis: true,
                      labelWidth: '145px',
                      wrapperAlign: 'left',
                    },
                  }}
                  fieldProps={{
                    _unsafe_MixedSetter_title_select: 'SlotSetter',
                    enum: [],
                    name: 'password',
                    required: true,
                    title: (
                      <Typography.Text
                        __component_name="Typography.Text"
                        disabled={false}
                        ellipsis={true}
                        strong={false}
                        style={{ fontSize: '', position: 'relative', top: '2px' }}
                        type="colorTextSecondary"
                      >
                        {this.i18n('i18n-yufusyzl') /* 密码 */}
                      </Typography.Text>
                    ),
                    'x-display':
                      "{{$form.values.info?.auth?.includes('true') ? 'visible': 'hidden'}}",
                    'x-validator': [
                      {
                        children: '未知',
                        id: 'disabled',
                        message: this.i18n('i18n-8hbax8oq') /* 请填写密码 */,
                        required: true,
                        type: 'disabled',
                      },
                    ],
                  }}
                />
                <Divider
                  __component_name="Divider"
                  children=""
                  content={[
                    [
                      <Row
                        __component_name="Row"
                        gutter={[0, 16]}
                        style={{}}
                        wrap={true}
                        key="node_oclkjgkdel1"
                      >
                        <Col __component_name="Col" span={24}>
                          <FormilyFormItem
                            __component_name="FormilyFormItem"
                            decoratorProps={{ 'x-decorator-props': { labelEllipsis: false } }}
                            fieldProps={{
                              _unsafe_MixedSetter_title_select: 'SlotSetter',
                              description: '',
                              name: 'pullStategy',
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
                                    {this.i18n('i18n-o7t5qsx5') /* 仓库同步设置 */}
                                  </Typography.Text>
                                  <Tooltip
                                    __component_name="Tooltip"
                                    title={
                                      this.i18n(
                                        'i18n-blmem1n4'
                                      ) /* 对组件仓库中的组件进行定时数据更新 */
                                    }
                                  >
                                    <Container
                                      __component_name="Container"
                                      color="colorTextDescription"
                                    >
                                      <AntdIconQuestionCircleOutlined
                                        __component_name="AntdIconQuestionCircleOutlined"
                                        style={{ color: '', position: 'relative', top: '2px' }}
                                      />
                                    </Container>
                                  </Tooltip>
                                </Space>
                              ),
                              'x-component': 'FormilyFormItem',
                              'x-validator': [],
                            }}
                            style={{}}
                          >
                            <Space
                              __component_name="Space"
                              align="center"
                              direction="horizontal"
                              size={40}
                            >
                              <FormilyNumberPicker
                                __component_name="FormilyNumberPicker"
                                componentProps={{
                                  'x-component-props': {
                                    addonBefore: this.i18n('i18n-2rvtjegc') /* 时间间隔 */,
                                    min: 1,
                                    placeholder: this.i18n('i18n-n9a8du2a') /* 请输入 */,
                                  },
                                }}
                                decoratorProps={{
                                  'x-decorator-props': {
                                    _unsafe_MixedSetter_addonAfter_select: 'SlotSetter',
                                    _unsafe_MixedSetter_addonBefore_select: 'SlotSetter',
                                    addonAfter: (
                                      <Typography.Text
                                        __component_name="Typography.Text"
                                        disabled={false}
                                        ellipsis={true}
                                        strong={false}
                                        style={{ fontSize: '' }}
                                      >
                                        {this.i18n('i18n-8hmhhcp4') /* S */}
                                      </Typography.Text>
                                    ),
                                    addonBefore: '',
                                    wrapperWidth: '',
                                  },
                                }}
                                fieldProps={{
                                  name: 'intervalSeconds',
                                  title: '',
                                  'x-validator': [],
                                }}
                                style={{ marginBottom: '0px', width: '150px' }}
                              />
                              <FormilyNumberPicker
                                __component_name="FormilyNumberPicker"
                                componentProps={{
                                  'x-component-props': {
                                    addonBefore: this.i18n('i18n-vf2r2t3g') /* 超时时间 */,
                                    min: 1,
                                    placeholder: this.i18n('i18n-n9a8du2a') /* 请输入 */,
                                  },
                                }}
                                decoratorProps={{
                                  'x-decorator-props': {
                                    _unsafe_MixedSetter_addonAfter_select: 'SlotSetter',
                                    _unsafe_MixedSetter_addonBefore_select: 'SlotSetter',
                                    addonAfter: (
                                      <Typography.Text
                                        __component_name="Typography.Text"
                                        disabled={false}
                                        ellipsis={true}
                                        strong={false}
                                        style={{ fontSize: '' }}
                                      >
                                        {this.i18n('i18n-8hmhhcp4') /* S */}
                                      </Typography.Text>
                                    ),
                                    addonBefore: '',
                                    wrapperWidth: '',
                                  },
                                }}
                                fieldProps={{
                                  name: 'timeoutSeconds',
                                  title: '',
                                  'x-validator': [],
                                }}
                                style={{ width: '150px' }}
                              />
                              <FormilyNumberPicker
                                __component_name="FormilyNumberPicker"
                                componentProps={{
                                  'x-component-props': {
                                    addonBefore: this.i18n('i18n-6p75zmij') /* 重试次数 */,
                                    min: 1,
                                    placeholder: this.i18n('i18n-n9a8du2a') /* 请输入 */,
                                    precision: 0,
                                  },
                                }}
                                decoratorProps={{
                                  'x-decorator-props': {
                                    _unsafe_MixedSetter_addonAfter_select: 'SlotSetter',
                                    _unsafe_MixedSetter_addonBefore_select: 'SlotSetter',
                                    addonAfter: (
                                      <Typography.Text
                                        __component_name="Typography.Text"
                                        disabled={false}
                                        ellipsis={true}
                                        strong={false}
                                        style={{ fontSize: '' }}
                                      >
                                        {this.i18n('i18n-k3pyvdbr') /* 次 */}
                                      </Typography.Text>
                                    ),
                                    addonBefore: '',
                                    labelEllipsis: true,
                                    wrapperWidth: '',
                                  },
                                }}
                                fieldProps={{ name: 'retry', title: '', 'x-validator': [] }}
                                style={{ width: '150px' }}
                              />
                            </Space>
                          </FormilyFormItem>
                          <FormilyFormItem
                            __component_name="FormilyFormItem"
                            decoratorProps={{
                              'x-decorator-props': { labelEllipsis: false, wrapperWidth: '850px' },
                            }}
                            fieldProps={{
                              _unsafe_MixedSetter_title_select: 'SlotSetter',
                              name: 'filter',
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
                                    {this.i18n('i18n-5bcb4vh8') /* 仓库组件过滤 */}
                                  </Typography.Text>
                                  <Tooltip
                                    __component_name="Tooltip"
                                    title={
                                      this.i18n(
                                        'i18n-y1e6lwsu'
                                      ) /* 未进行过滤设置的组件将保留其全部版本 */
                                    }
                                  >
                                    <Container
                                      __component_name="Container"
                                      color="colorTextDescription"
                                    >
                                      <AntdIconQuestionCircleOutlined
                                        __component_name="AntdIconQuestionCircleOutlined"
                                        style={{ color: '', position: 'relative', top: '2px' }}
                                      />
                                    </Container>
                                  </Tooltip>
                                </Space>
                              ),
                              'x-component': 'FormilyFormItem',
                              'x-validator': [],
                            }}
                            style={{}}
                          >
                            <FormilyArrayTable
                              __component_name="FormilyArrayTable"
                              decoratorProps={{ 'x-decorator-props': { labelEllipsis: true } }}
                              fieldProps={{ name: 'value', type: 'array', 'x-validator': [] }}
                            >
                              <FormilyArrayTable.Column
                                __component_name="FormilyArrayTable.Column"
                                title={this.i18n('i18n-cuf6u4di') /* 组件名称 */}
                              >
                                <FormilyInput
                                  __component_name="FormilyInput"
                                  componentProps={{
                                    'x-component-props': {
                                      placeholder:
                                        this.i18n('i18n-zz8l4ytx') /* 请填写完整的组件名称 */,
                                    },
                                  }}
                                  fieldProps={{
                                    name: 'name',
                                    required: true,
                                    'x-validator': [
                                      {
                                        children: '未知',
                                        id: 'disabled',
                                        message:
                                          this.i18n(
                                            'i18n-hzu1j2jl'
                                          ) /* 由3~63个小写字母、数字、中划线“-”或点“.”组成，并以字母、数字开头或结尾 */,
                                        pattern: __$$eval(() =>
                                          this.utils.getNameReg({
                                            max: 63,
                                          })
                                        ),
                                        required: false,
                                        type: 'disabled',
                                      },
                                      {
                                        _unsafe_MixedSetter_message_select: 'StringSetter',
                                        children: '未知',
                                        id: 'disabled',
                                        message: '',
                                        type: 'disabled',
                                        validator: function () {
                                          return this.validatorComponentName.apply(
                                            this,
                                            Array.prototype.slice.call(arguments).concat([])
                                          );
                                        }.bind(this),
                                      },
                                    ],
                                  }}
                                  style={{}}
                                />
                              </FormilyArrayTable.Column>
                              <FormilyArrayTable.Column
                                __component_name="FormilyArrayTable.Column"
                                title={this.i18n('i18n-xw5z4b0a') /* 废弃版本 */}
                              >
                                <FormilySelect
                                  __component_name="FormilySelect"
                                  componentProps={{
                                    'x-component-props': {
                                      _sdkSwrGetFunc: {},
                                      allowClear: false,
                                      disabled: false,
                                      placeholder: this.i18n('i18n-fald39iq') /* 请选择 */,
                                    },
                                  }}
                                  fieldProps={{
                                    default: 'true',
                                    enum: [
                                      {
                                        children: '',
                                        id: 'disabled',
                                        label: this.i18n('i18n-r1zean6b') /* 保留 */,
                                        type: 'disabled',
                                        value: 'true',
                                      },
                                      {
                                        children: '',
                                        id: 'disabled',
                                        label: this.i18n('i18n-54cgv8pm') /* 过滤 */,
                                        type: 'disabled',
                                        value: 'false',
                                      },
                                    ],
                                    name: 'keepDeprecated',
                                    'x-validator': [],
                                  }}
                                />
                              </FormilyArrayTable.Column>
                              <FormilyArrayTable.Column
                                __component_name="FormilyArrayTable.Column"
                                title={this.i18n('i18n-ufn05c8r') /* 正常版本 */}
                              >
                                <Space
                                  __component_name="Space"
                                  align="center"
                                  direction="horizontal"
                                >
                                  <FormilySelect
                                    __component_name="FormilySelect"
                                    componentProps={{
                                      'x-component-props': {
                                        _sdkSwrGetFunc: {},
                                        allowClear: false,
                                        disabled: false,
                                        placeholder: this.i18n('i18n-fald39iq') /* 请选择 */,
                                      },
                                    }}
                                    decoratorProps={{
                                      'x-decorator-props': {
                                        asterisk: false,
                                        colon: false,
                                        tooltip: '',
                                      },
                                    }}
                                    fieldProps={{
                                      default: 'ignore_all',
                                      enum: [
                                        {
                                          children: '',
                                          id: 'disabled',
                                          label: this.i18n('i18n-r4pp6mwv') /* 全部过滤 */,
                                          type: 'disabled',
                                          value: 'ignore_all',
                                        },
                                        {
                                          children: '',
                                          id: 'disabled',
                                          label: this.i18n('i18n-or6btdf3') /* 精确过滤 */,
                                          type: 'disabled',
                                          value: 'ignore_exact',
                                        },
                                        {
                                          children: '',
                                          id: 'disabled',
                                          label: this.i18n('i18n-ndhridkq') /* 精确保留 */,
                                          type: 'disabled',
                                          value: 'keep_exact',
                                        },
                                      ],
                                      name: 'operation',
                                      'x-validator': [
                                        {
                                          children: '未知',
                                          id: 'disabled',
                                          type: 'disabled',
                                          validator: function () {
                                            return this.validatorDisabled.apply(
                                              this,
                                              Array.prototype.slice.call(arguments).concat([])
                                            );
                                          }.bind(this),
                                        },
                                      ],
                                    }}
                                  />
                                  <FormilyInput
                                    __component_name="FormilyInput"
                                    componentProps={{
                                      'x-component-props': {
                                        placeholder:
                                          this.i18n('i18n-e4qgvfg7') /* 请完整填写版本 */,
                                      },
                                    }}
                                    fieldProps={{
                                      name: 'versions',
                                      'x-pattern': 'disabled',
                                      'x-validator': [],
                                    }}
                                    style={{}}
                                  />
                                  <FormilyInput
                                    __component_name="FormilyInput"
                                    componentProps={{
                                      'x-component-props': {
                                        placeholder:
                                          this.i18n('i18n-7b4geri9') /* 请填写版本正则表达式 */,
                                      },
                                    }}
                                    fieldProps={{
                                      name: 'regexp',
                                      'x-pattern': 'disabled',
                                      'x-validator': [],
                                    }}
                                    style={{}}
                                  />
                                  <FormilyInput
                                    __component_name="FormilyInput"
                                    componentProps={{
                                      'x-component-props': {
                                        placeholder:
                                          this.i18n('i18n-hve94tyf') /* 请填写版本约束条件 */,
                                      },
                                    }}
                                    fieldProps={{
                                      name: 'versionConstraint',
                                      'x-pattern': 'disabled',
                                      'x-validator': [],
                                    }}
                                    style={{}}
                                  />
                                </Space>
                              </FormilyArrayTable.Column>
                              <FormilyArrayTable.Operation
                                __component_name="FormilyArrayTable.Operation"
                                title={this.i18n('i18n-ioy0ge9h') /* 操作 */}
                                width={50}
                              />
                              <FormilyArrayTable.Addition
                                __component_name="FormilyArrayTable.Addition"
                                title={this.i18n('i18n-1vi37ku6') /* 添加 */}
                              />
                            </FormilyArrayTable>
                          </FormilyFormItem>
                        </Col>
                      </Row>,
                      <Row __component_name="Row" style={{}} wrap={true} key="node_oclkjh34mr1">
                        <Col __component_name="Col" span={24}>
                          <FormilyFormItem
                            __component_name="FormilyFormItem"
                            decoratorProps={{
                              'x-decorator-props': {
                                labelEllipsis: true,
                                style: { marginTop: '10px' },
                                wrapperWidth: '850px',
                              },
                            }}
                            fieldProps={{
                              name: 'imageOverride',
                              title: this.i18n('i18n-guv8z978') /* 镜像仓库替换 */,
                              type: 'object',
                              'x-component': 'FormilyFormItem',
                              'x-validator': [],
                            }}
                            style={{}}
                          >
                            <FormilyArrayCards
                              __component_name="FormilyArrayCards"
                              decoratorProps={{
                                'x-decorator-props': {
                                  labelEllipsis: true,
                                  style: {},
                                  wrapperWidth: '',
                                },
                              }}
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
                                name: 'value',
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
                                size={30}
                                style={{
                                  alignItems: 'baseline',
                                  display: 'flex',
                                  marginRight: '0px',
                                }}
                              >
                                <Space
                                  __component_name="Space"
                                  align="center"
                                  direction="horizontal"
                                  style={{ alignItems: 'baseline', display: 'flex' }}
                                >
                                  <FormilyInput
                                    __component_name="FormilyInput"
                                    componentProps={{
                                      'x-component-props': {
                                        placeholder: this.i18n('i18n-msztcfd3') /* 请输入原域名 */,
                                      },
                                    }}
                                    decoratorProps={{
                                      'x-decorator-props': { labelEllipsis: true },
                                    }}
                                    fieldProps={{
                                      name: 'registry',
                                      required: true,
                                      title: '',
                                      'x-validator': [
                                        {
                                          children: '未知',
                                          id: 'disabled',
                                          type: 'disabled',
                                          validator: function () {
                                            return this.validatorDomainName.apply(
                                              this,
                                              Array.prototype.slice.call(arguments).concat([])
                                            );
                                          }.bind(this),
                                        },
                                      ],
                                    }}
                                  />
                                  <Typography.Text
                                    __component_name="Typography.Text"
                                    disabled={false}
                                    ellipsis={true}
                                    strong={false}
                                    style={{ fontSize: '', verticalAlign: 'bas' }}
                                  >
                                    /
                                  </Typography.Text>
                                  <FormilyInput
                                    __component_name="FormilyInput"
                                    componentProps={{
                                      'x-component-props': {
                                        placeholder:
                                          this.i18n('i18n-8im5lu89') /* 请输入原仓库组 */,
                                      },
                                    }}
                                    decoratorProps={{
                                      'x-decorator-props': { labelEllipsis: true },
                                    }}
                                    fieldProps={{
                                      name: 'path',
                                      required: true,
                                      title: '',
                                      'x-validator': [
                                        {
                                          children: '未知',
                                          id: 'disabled',
                                          message: '',
                                          type: 'disabled',
                                          validator: function () {
                                            return this.validatorRepoName.apply(
                                              this,
                                              Array.prototype.slice.call(arguments).concat([])
                                            );
                                          }.bind(this),
                                        },
                                      ],
                                    }}
                                  />
                                </Space>
                                <Typography.Text
                                  __component_name="Typography.Text"
                                  disabled={false}
                                  ellipsis={true}
                                  strong={false}
                                  style={{ fontSize: '', verticalAlign: 'bas' }}
                                >
                                  {this.i18n('i18n-xeckog8e') /* 替换为 */}
                                </Typography.Text>
                                <Space
                                  __component_name="Space"
                                  align="center"
                                  direction="horizontal"
                                  style={{ alignItems: 'baseline', display: 'flex' }}
                                >
                                  <FormilyInput
                                    __component_name="FormilyInput"
                                    componentProps={{
                                      'x-component-props': {
                                        placeholder: this.i18n('i18n-hoamre8k') /* 请输入新域名 */,
                                      },
                                    }}
                                    decoratorProps={{
                                      'x-decorator-props': { labelEllipsis: true },
                                    }}
                                    fieldProps={{
                                      name: 'newRegistry',
                                      required: true,
                                      title: '',
                                      'x-validator': [
                                        {
                                          children: '未知',
                                          id: 'disabled',
                                          type: 'disabled',
                                          validator: function () {
                                            return this.validatorDomain.apply(
                                              this,
                                              Array.prototype.slice.call(arguments).concat([])
                                            );
                                          }.bind(this),
                                        },
                                      ],
                                    }}
                                  />
                                  <Typography.Text
                                    __component_name="Typography.Text"
                                    disabled={false}
                                    ellipsis={true}
                                    strong={false}
                                    style={{ fontSize: '', verticalAlign: 'bas' }}
                                  >
                                    /
                                  </Typography.Text>
                                  <FormilyInput
                                    __component_name="FormilyInput"
                                    componentProps={{
                                      'x-component-props': {
                                        placeholder:
                                          this.i18n('i18n-jwjqcqiq') /* 请输入新仓库组 */,
                                      },
                                    }}
                                    decoratorProps={{
                                      'x-decorator-props': { labelEllipsis: true },
                                    }}
                                    fieldProps={{
                                      name: 'newPath',
                                      required: true,
                                      title: '',
                                      'x-validator': [
                                        {
                                          children: '未知',
                                          id: 'disabled',
                                          type: 'disabled',
                                          validator: function () {
                                            return this.validatorRepo.apply(
                                              this,
                                              Array.prototype.slice.call(arguments).concat([])
                                            );
                                          }.bind(this),
                                        },
                                      ],
                                    }}
                                  />
                                </Space>
                              </Space>
                            </FormilyArrayCards>
                          </FormilyFormItem>
                          {!!__$$eval(() => this.state.hasRatingDeployed) && (
                            <FormilySwitch
                              __component_name="FormilySwitch"
                              componentProps={{
                                'x-component-props': { disabled: false, loading: false },
                              }}
                              decoratorProps={{ 'x-decorator-props': { labelEllipsis: true } }}
                              fieldProps={{
                                description:
                                  this.i18n(
                                    'i18n-hm90oqjw'
                                  ) /* 开启后，进入组件市场，对仓库内组件发起评测。将从安全性、可靠性等方面对组件给出评测结果及建议，供您参考 */,
                                name: 'enableRating',
                                title: this.i18n('i18n-thxp526w') /* 组件评测 */,
                                'x-validator': [],
                              }}
                            />
                          )}
                          {!!__$$eval(() => !this.state.hasRatingDeployed) && (
                            <FormilyFormItem
                              __component_name="FormilyFormItem"
                              decoratorProps={{ 'x-decorator-props': { labelEllipsis: true } }}
                              fieldProps={{
                                name: 'enableRatingWrapper',
                                title: this.i18n('i18n-thxp526w') /* 组件评测 */,
                                type: 'object',
                                'x-component': 'FormilyFormItem',
                                'x-validator': [],
                              }}
                            >
                              <Tooltip
                                __component_name="Tooltip"
                                placement="topLeft"
                                title={
                                  this.i18n('i18n-xpbdirgh') /* 评测系统组件未完全部署，请检查 */
                                }
                              >
                                <FormilySwitch
                                  __component_name="FormilySwitch"
                                  componentProps={{
                                    'x-component-props': { disabled: true, loading: false },
                                  }}
                                  decoratorProps={{ 'x-decorator-props': { labelEllipsis: true } }}
                                  fieldProps={{
                                    description:
                                      this.i18n(
                                        'i18n-hm90oqjw'
                                      ) /* 开启后，进入组件市场，对仓库内组件发起评测。将从安全性、可靠性等方面对组件给出评测结果及建议，供您参考 */,
                                    name: 'enableRating',
                                    title: '',
                                    'x-pattern': 'disabled',
                                    'x-validator': [],
                                  }}
                                />
                              </Tooltip>
                            </FormilyFormItem>
                          )}
                        </Col>
                      </Row>,
                    ],
                  ]}
                  dashed={true}
                  defaultOpen={__$$eval(() => this.props.appHelper?.match?.params?.id !== 'create')}
                  mode="expanded"
                  orientation="left"
                  orientationMargin={0}
                >
                  <Typography.Text
                    __component_name="Typography.Text"
                    disabled={false}
                    ellipsis={true}
                    strong={false}
                    style={{ fontSize: '', position: 'relative', top: '2px' }}
                    type="colorPrimary"
                  >
                    {this.i18n('i18n-4wrnn3o8') /* 高级配置 */}
                  </Typography.Text>
                </Divider>
                <Divider
                  __component_name="Divider"
                  dashed={false}
                  defaultOpen={false}
                  mode="line"
                  style={{ marginLeft: '-24px', width: 'calc(100% + 48px)' }}
                />
                <FormilyFormItem
                  __component_name="FormilyFormItem"
                  decoratorProps={{ 'x-decorator-props': { labelEllipsis: true } }}
                  fieldProps={{
                    _unsafe_MixedSetter_title_select: 'SlotSetter',
                    name: 'FormilyFormItem1',
                    title: '',
                    type: 'object',
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
                      style={{ marginLeft: '145px' }}
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
  const match = matchPath({ path: '/components/warehouse/:id' }, location.pathname);
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
        <ComponentsWarehouseCreate$$Page
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
