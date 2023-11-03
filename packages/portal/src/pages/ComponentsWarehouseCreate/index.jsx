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

    this.state = { isCreate: true, creating: false, name: undefined, cluster: undefined };
  }

  $ = refName => {
    return this._refsManager.get(refName);
  };

  $$ = refName => {
    return this._refsManager.getAll(refName);
  };

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
      });
      this.initDisabled();
      return;
    }
    setTimeout(() => {
      this.initForms(v);
    }, 200);
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

  onCancel(event) {
    this.history.go(-1);
  }

  form(name) {
    return this.$(name || 'formily_create')?.formRef?.current?.form;
  }

  beforeUpload() {
    return false;
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

  componentDidMount() {
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
        <Row wrap={true} __component_name="Row">
          <Col span={24} __component_name="Col">
            <Space align="center" direction="horizontal" __component_name="Space">
              <Button.Back
                name={this.i18n('i18n-86so9ago') /* 返回 */}
                type="primary"
                title={this.i18n('i18n-qwjrzcj4') /* 新建组件仓库 */}
                __component_name="Button.Back"
              />
            </Space>
            <Tag
              color="rgba(0,0,0,0.65)"
              style={{
                position: 'relative',
                marginTop: '-5px',
                marginLeft: '16px',
                marginRight: '0px',
                borderRadius: '0',
                borderTopLeftRadius: '2px',
                borderBottomLeftRadius: '2px',
              }}
              closable={false}
              __component_name="Tag"
            >
              {this.i18n('i18n-yfkq2xqq') /* 集群 */}
            </Tag>
            <Tag
              color="#ffffff"
              style={{
                color: 'rgba(0,0,0,0.85)',
                position: 'relative',
                marginTop: '-5px',
                borderRadius: '0',
                borderTopRightRadius: '2px',
                borderBottomRightRadius: '2px',
              }}
              closable={false}
              __component_name="Tag"
            >
              {__$$eval(() => this.getClusterInfo()?.fullName || '-')}
            </Tag>
          </Col>
          <Col span={24} __component_name="Col">
            <Card
              size="default"
              type="default"
              cover=""
              actions={[]}
              loading={false}
              bordered={false}
              hoverable={false}
              __component_name="Card"
            >
              <FormilyForm
                ref={this._refsManager.linkRef('formily_create')}
                formHelper={{ autoFocus: true }}
                componentProps={{
                  colon: false,
                  layout: 'horizontal',
                  labelCol: 4,
                  labelAlign: 'left',
                  labelWidth: '145px',
                  wrapperCol: 20,
                  wrapperWidth: '680px',
                }}
                __component_name="FormilyForm"
              >
                <FormilyInput
                  fieldProps={{
                    name: 'name',
                    title: this.i18n('i18n-x25agmsc') /* 名称 */,
                    required: true,
                    'x-pattern': __$$eval(() =>
                      this.props.appHelper?.match?.params?.id !== 'create' ? 'disabled' : 'editable'
                    ),
                    'x-validator': [
                      {
                        id: 'disabled',
                        type: 'disabled',
                        message:
                          this.i18n(
                            'i18n-dzffs2mw'
                          ) /* 由3~253个小写字母、数字、中划线“-”或点“.”组成，并以字母、数字开头或结尾 */,
                        pattern: __$$eval(() =>
                          this.utils.getNameReg({
                            max: 253,
                          })
                        ),
                        children: '未知',
                        required: false,
                        whitespace: false,
                      },
                      {
                        id: 'disabled',
                        type: 'disabled',
                        message: this.i18n('i18n-dofmyljq') /* “.”  和 “-” 不能连用 */,
                        children: '未知',
                        validator: function () {
                          return this.validatorNameCharacter.apply(
                            this,
                            Array.prototype.slice.call(arguments).concat([])
                          );
                        }.bind(this),
                      },
                      {
                        id: 'disabled',
                        type: 'disabled',
                        message: this.i18n('i18n-52vob0jn') /* 仓库名称重复 */,
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
                      placeholder: this.i18n('i18n-psh5pyle') /* 请填写组件仓库名称 */,
                    },
                  }}
                  decoratorProps={{
                    'x-decorator-props': { asterisk: false, wrapperCol: 10, labelEllipsis: true },
                  }}
                  __component_name="FormilyInput"
                />
                <FormilyInput
                  ref={this._refsManager.linkRef('formilyinput-24ff12d0')}
                  fieldProps={{
                    name: 'url',
                    title: this.i18n('i18n-iqh7qzhi') /* URL */,
                    required: true,
                    'x-pattern': __$$eval(() =>
                      this.props.appHelper?.match?.params?.id !== 'create' ? 'disabled' : 'editable'
                    ),
                    'x-validator': [
                      {
                        id: 'disabled',
                        type: 'disabled',
                        message: this.i18n('i18n-q9gsf3z5') /* URL 格式不正确 */,
                        children: '未知',
                        validator: function () {
                          return this.validatorUrl.apply(
                            this,
                            Array.prototype.slice.call(arguments).concat([])
                          );
                        }.bind(this),
                      },
                    ],
                  }}
                  componentProps={{
                    'x-component-props': {
                      placeholder:
                        this.i18n('i18n-1lkuumnu') /* 请填写组件仓库地址，例http://ip(host):port */,
                    },
                  }}
                  decoratorProps={{ 'x-decorator-props': { asterisk: true, labelEllipsis: true } }}
                  __component_name="FormilyInput"
                />
                {!!false && (
                  <FormilySelect
                    fieldProps={{
                      enum: [
                        {
                          id: 'disabled',
                          type: 'disabled',
                          label: 'Git',
                          value: 'Git',
                          children: '',
                        },
                        {
                          id: 'disabled',
                          type: 'disabled',
                          label: 'Chart Museum',
                          value: 'ChartMuseum',
                          children: '',
                        },
                      ],
                      name: 'repositoryType',
                      title: this.i18n('i18n-gyax19ni') /* 类型 */,
                      default: '',
                      required: true,
                      'x-pattern': __$$eval(() =>
                        this.props.appHelper?.match?.params?.id !== 'create'
                          ? 'disabled'
                          : 'editable'
                      ),
                      'x-validator': [],
                    }}
                    componentProps={{
                      'x-component-props': {
                        disabled: __$$eval(
                          () => this.props.appHelper?.match?.params?.id !== 'create'
                        ),
                        allowClear: false,
                        placeholder: this.i18n('i18n-n0h4rmtn') /* 请选择组件仓库类型 */,
                        _sdkSwrGetFunc: {},
                      },
                    }}
                    decoratorProps={{ 'x-decorator-props': { asterisk: false } }}
                    __component_name="FormilySelect"
                  />
                )}
                <FormilyCheckbox
                  ref={this._refsManager.linkRef('formilycheckbox-cc84e65a')}
                  style={{}}
                  fieldProps={{
                    enum: [{ label: this.i18n('i18n-pe8t9yro') /* https 验证 */, value: 'true' }],
                    name: 'insecure',
                    title: this.i18n('i18n-utwwqntm') /* 安全信息 */,
                    'x-validator': [],
                  }}
                  componentProps={{ 'x-component-props': { _sdkSwrGetFunc: {} } }}
                  __component_name="FormilyCheckbox"
                />
                <FormilyUpload
                  ref={this._refsManager.linkRef('formilyupload-666ef891')}
                  style={{}}
                  fieldProps={{
                    name: 'cadata',
                    title: (
                      <Typography.Text
                        type="colorTextSecondary"
                        style={{ top: '2px', fontSize: '', position: 'relative' }}
                        strong={false}
                        disabled={false}
                        ellipsis={true}
                        __component_name="Typography.Text"
                      >
                        {this.i18n('i18n-r8c2xx03') /* 根证书 */}
                      </Typography.Text>
                    ),
                    'x-display':
                      "{{$form.values?.insecure?.includes('true') ? 'visible': 'hidden'}}",
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
                    _unsafe_MixedSetter_title_select: 'SlotSetter',
                  }}
                  componentProps={{
                    'x-component-props': {
                      accept: '.der,.cer,.pem,.crt,.key,.p7b,.p7c,.pfx',
                      maxCount: 1,
                      beforeUpload: function () {
                        return this.beforeUpload.apply(
                          this,
                          Array.prototype.slice.call(arguments).concat([])
                        );
                      }.bind(this),
                      uploadListInline: true,
                    },
                  }}
                  decoratorProps={{
                    'x-decorator-props': {
                      colon: false,
                      asterisk: true,
                      labelAlign: 'left',
                      labelWidth: '145px',
                    },
                  }}
                  __component_name="FormilyUpload"
                >
                  <Button
                    ref={this._refsManager.linkRef('button-15001b03')}
                    icon={<AntdIconUploadOutlined __component_name="AntdIconUploadOutlined" />}
                    type="primary"
                    block={false}
                    ghost={true}
                    shape="default"
                    style={{}}
                    danger={false}
                    disabled={false}
                    __component_name="Button"
                  >
                    {this.i18n('i18n-b8lgc3ot') /* 上传 */}
                  </Button>
                </FormilyUpload>
                <FormilyUpload
                  ref={this._refsManager.linkRef('formilyupload-666ef891')}
                  style={{}}
                  fieldProps={{
                    name: 'certdata',
                    title: (
                      <Typography.Text
                        type="colorTextSecondary"
                        style={{ top: '2px', fontSize: '', position: 'relative' }}
                        strong={false}
                        disabled={false}
                        ellipsis={true}
                        __component_name="Typography.Text"
                      >
                        {this.i18n('i18n-dx6dp5fl') /* 客户端证书 */}
                      </Typography.Text>
                    ),
                    'x-display':
                      "{{$form.values?.insecure?.includes('true') ? 'visible': 'hidden'}}",
                    'x-component': 'FormilyUpload',
                    'x-validator': [],
                    _unsafe_MixedSetter_title_select: 'SlotSetter',
                  }}
                  componentProps={{
                    'x-component-props': {
                      accept: '.der,.cer,.pem,.crt,.key,.p7b,.p7c,.pfx',
                      maxCount: 1,
                      beforeUpload: function () {
                        return this.beforeUpload.apply(
                          this,
                          Array.prototype.slice.call(arguments).concat([])
                        );
                      }.bind(this),
                      uploadListInline: true,
                    },
                  }}
                  decoratorProps={{
                    'x-decorator-props': {
                      colon: false,
                      asterisk: false,
                      labelAlign: 'left',
                      labelWidth: '145px',
                    },
                  }}
                  __component_name="FormilyUpload"
                >
                  <Button
                    ref={this._refsManager.linkRef('button-15001b03')}
                    icon={<AntdIconUploadOutlined __component_name="AntdIconUploadOutlined" />}
                    type="primary"
                    block={false}
                    ghost={true}
                    shape="default"
                    style={{}}
                    danger={false}
                    disabled={false}
                    __component_name="Button"
                  >
                    {this.i18n('i18n-b8lgc3ot') /* 上传 */}
                  </Button>
                </FormilyUpload>
                <FormilyUpload
                  ref={this._refsManager.linkRef('formilyupload-666ef891')}
                  style={{}}
                  fieldProps={{
                    name: 'keydata',
                    title: (
                      <Typography.Text
                        type="colorTextSecondary"
                        style={{ top: '2px', fontSize: '', position: 'relative' }}
                        strong={false}
                        disabled={false}
                        ellipsis={true}
                        __component_name="Typography.Text"
                      >
                        {this.i18n('i18n-4g9ld3fm') /* 客户端私钥 */}
                      </Typography.Text>
                    ),
                    'x-display':
                      "{{$form.values?.insecure?.includes('true') ? 'visible': 'hidden'}}",
                    'x-component': 'FormilyUpload',
                    'x-validator': [],
                    _unsafe_MixedSetter_title_select: 'SlotSetter',
                  }}
                  componentProps={{
                    'x-component-props': {
                      accept: '.der,.cer,.pem,.crt,.key,.p7b,.p7c,.pfx',
                      maxCount: 1,
                      beforeUpload: function () {
                        return this.beforeUpload.apply(
                          this,
                          Array.prototype.slice.call(arguments).concat([])
                        );
                      }.bind(this),
                      uploadListInline: true,
                    },
                  }}
                  decoratorProps={{
                    'x-decorator-props': {
                      colon: false,
                      asterisk: false,
                      labelAlign: 'left',
                      labelWidth: '145px',
                    },
                  }}
                  __component_name="FormilyUpload"
                >
                  <Button
                    ref={this._refsManager.linkRef('button-15001b03')}
                    icon={<AntdIconUploadOutlined __component_name="AntdIconUploadOutlined" />}
                    type="primary"
                    block={false}
                    ghost={true}
                    shape="default"
                    style={{}}
                    danger={false}
                    disabled={false}
                    __component_name="Button"
                  >
                    {this.i18n('i18n-b8lgc3ot') /* 上传 */}
                  </Button>
                </FormilyUpload>
                <FormilyFormItem
                  ref={this._refsManager.linkRef('formilyformitem-87c69db9')}
                  style={{}}
                  fieldProps={{
                    name: 'info',
                    title: this.i18n('i18n-cau0sbxf') /*     */,
                    'x-component': 'FormilyFormItem',
                    'x-validator': [],
                  }}
                  componentProps={{ 'x-component-props': {} }}
                  __component_name="FormilyFormItem"
                >
                  <FormilyCheckbox
                    fieldProps={{
                      enum: [{ label: this.i18n('i18n-iqgm02qd') /* 安全认证 */, value: 'true' }],
                      name: 'auth',
                      title: '',
                      'x-validator': [],
                    }}
                    componentProps={{ 'x-component-props': { _sdkSwrGetFunc: {} } }}
                    __component_name="FormilyCheckbox"
                  />
                  {!!false && (
                    <FormilyInput
                      ref={this._refsManager.linkRef('formilyinput-87f9c4b3')}
                      fieldProps={{
                        name: 'username',
                        title: this.i18n('i18n-h2dtugcf') /* 用户名 */,
                        required: true,
                        'x-validator': [],
                      }}
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
                      __component_name="FormilyInput"
                    />
                  )}
                  {!!false && (
                    <FormilyPassword
                      ref={this._refsManager.linkRef('formilypassword-87a8b44b')}
                      fieldProps={{
                        name: 'Password',
                        title: this.i18n('i18n-yufusyzl') /* 密码 */,
                        required: true,
                        'x-validator': [],
                      }}
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
                      __component_name="FormilyPassword"
                    />
                  )}
                </FormilyFormItem>
                <FormilyInput
                  ref={this._refsManager.linkRef('formilyinput-245edefa')}
                  style={{}}
                  fieldProps={{
                    enum: [],
                    name: 'username',
                    title: (
                      <Typography.Text
                        type="colorTextSecondary"
                        style={{ top: '2px', fontSize: '', position: 'relative' }}
                        strong={false}
                        disabled={false}
                        ellipsis={true}
                        __component_name="Typography.Text"
                      >
                        {this.i18n('i18n-h2dtugcf') /* 用户名 */}
                      </Typography.Text>
                    ),
                    required: true,
                    'x-display':
                      "{{$form.values.info?.auth?.includes('true') ? 'visible': 'hidden'}}",
                    'x-validator': [
                      {
                        id: 'disabled',
                        type: 'disabled',
                        message: this.i18n('i18n-ct1um5i8') /* 请填写认证用户名 */,
                        children: '未知',
                        required: true,
                      },
                    ],
                    _unsafe_MixedSetter_title_select: 'SlotSetter',
                  }}
                  componentProps={{
                    'x-component-props': {
                      placeholder: this.i18n('i18n-ct1um5i8') /* 请填写认证用户名 */,
                    },
                  }}
                  decoratorProps={{ 'x-decorator-props': { asterisk: true } }}
                  __component_name="FormilyInput"
                />
                <FormilyPassword
                  fieldProps={{
                    enum: [],
                    name: 'password',
                    title: (
                      <Typography.Text
                        type="colorTextSecondary"
                        style={{ top: '2px', fontSize: '', position: 'relative' }}
                        strong={false}
                        disabled={false}
                        ellipsis={true}
                        __component_name="Typography.Text"
                      >
                        {this.i18n('i18n-yufusyzl') /* 密码 */}
                      </Typography.Text>
                    ),
                    required: true,
                    'x-display':
                      "{{$form.values.info?.auth?.includes('true') ? 'visible': 'hidden'}}",
                    'x-validator': [
                      {
                        id: 'disabled',
                        type: 'disabled',
                        message: this.i18n('i18n-8hbax8oq') /* 请填写密码 */,
                        children: '未知',
                        required: true,
                      },
                    ],
                    _unsafe_MixedSetter_title_select: 'SlotSetter',
                  }}
                  componentProps={{
                    'x-component-props': {
                      placeholder: this.i18n('i18n-8hbax8oq') /* 请填写密码 */,
                    },
                  }}
                  decoratorProps={{
                    'x-decorator-props': {
                      colon: false,
                      asterisk: true,
                      labelAlign: 'left',
                      labelWidth: '145px',
                      wrapperAlign: 'left',
                    },
                  }}
                  __component_name="FormilyPassword"
                />
                <Divider
                  mode="expanded"
                  dashed={true}
                  content={[
                    [
                      <Row
                        wrap={true}
                        style={{}}
                        gutter={[0, 16]}
                        __component_name="Row"
                        key="node_oclkjgkdel1"
                      >
                        <Col span={24} __component_name="Col">
                          <FormilyFormItem
                            style={{}}
                            fieldProps={{
                              name: 'pullStategy',
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
                                    {this.i18n('i18n-o7t5qsx5') /* 仓库同步设置 */}
                                  </Typography.Text>
                                  <Tooltip
                                    title={
                                      this.i18n(
                                        'i18n-blmem1n4'
                                      ) /* 对组件仓库中的组件进行定时数据更新 */
                                    }
                                    __component_name="Tooltip"
                                  >
                                    <Container
                                      color="colorTextDescription"
                                      __component_name="Container"
                                    >
                                      <AntdIconQuestionCircleOutlined
                                        style={{ top: '2px', color: '', position: 'relative' }}
                                        __component_name="AntdIconQuestionCircleOutlined"
                                      />
                                    </Container>
                                  </Tooltip>
                                </Space>
                              ),
                              description: '',
                              'x-component': 'FormilyFormItem',
                              'x-validator': [],
                              _unsafe_MixedSetter_title_select: 'SlotSetter',
                            }}
                            decoratorProps={{ 'x-decorator-props': { labelEllipsis: false } }}
                            __component_name="FormilyFormItem"
                          >
                            <Space
                              size={40}
                              align="center"
                              direction="horizontal"
                              __component_name="Space"
                            >
                              <FormilyNumberPicker
                                style={{ width: '150px', marginBottom: '0px' }}
                                fieldProps={{
                                  name: 'intervalSeconds',
                                  title: '',
                                  'x-validator': [],
                                }}
                                componentProps={{
                                  'x-component-props': {
                                    min: 1,
                                    addonBefore: this.i18n('i18n-2rvtjegc') /* 时间间隔 */,
                                    placeholder: this.i18n('i18n-n9a8du2a') /* 请输入 */,
                                  },
                                }}
                                decoratorProps={{
                                  'x-decorator-props': {
                                    addonAfter: (
                                      <Typography.Text
                                        style={{ fontSize: '' }}
                                        strong={false}
                                        disabled={false}
                                        ellipsis={true}
                                        __component_name="Typography.Text"
                                      >
                                        {this.i18n('i18n-8hmhhcp4') /* S */}
                                      </Typography.Text>
                                    ),
                                    addonBefore: '',
                                    wrapperWidth: '',
                                    _unsafe_MixedSetter_addonAfter_select: 'SlotSetter',
                                    _unsafe_MixedSetter_addonBefore_select: 'SlotSetter',
                                  },
                                }}
                                __component_name="FormilyNumberPicker"
                              />
                              <FormilyNumberPicker
                                style={{ width: '150px' }}
                                fieldProps={{
                                  name: 'timeoutSeconds',
                                  title: '',
                                  'x-validator': [],
                                }}
                                componentProps={{
                                  'x-component-props': {
                                    min: 1,
                                    addonBefore: this.i18n('i18n-vf2r2t3g') /* 超时时间 */,
                                    placeholder: this.i18n('i18n-n9a8du2a') /* 请输入 */,
                                  },
                                }}
                                decoratorProps={{
                                  'x-decorator-props': {
                                    addonAfter: (
                                      <Typography.Text
                                        style={{ fontSize: '' }}
                                        strong={false}
                                        disabled={false}
                                        ellipsis={true}
                                        __component_name="Typography.Text"
                                      >
                                        {this.i18n('i18n-8hmhhcp4') /* S */}
                                      </Typography.Text>
                                    ),
                                    addonBefore: '',
                                    wrapperWidth: '',
                                    _unsafe_MixedSetter_addonAfter_select: 'SlotSetter',
                                    _unsafe_MixedSetter_addonBefore_select: 'SlotSetter',
                                  },
                                }}
                                __component_name="FormilyNumberPicker"
                              />
                              <FormilyNumberPicker
                                style={{ width: '150px' }}
                                fieldProps={{ name: 'retry', title: '', 'x-validator': [] }}
                                componentProps={{
                                  'x-component-props': {
                                    min: 1,
                                    precision: 0,
                                    addonBefore: this.i18n('i18n-6p75zmij') /* 重试次数 */,
                                    placeholder: this.i18n('i18n-n9a8du2a') /* 请输入 */,
                                  },
                                }}
                                decoratorProps={{
                                  'x-decorator-props': {
                                    addonAfter: (
                                      <Typography.Text
                                        style={{ fontSize: '' }}
                                        strong={false}
                                        disabled={false}
                                        ellipsis={true}
                                        __component_name="Typography.Text"
                                      >
                                        {this.i18n('i18n-k3pyvdbr') /* 次 */}
                                      </Typography.Text>
                                    ),
                                    addonBefore: '',
                                    wrapperWidth: '',
                                    labelEllipsis: true,
                                    _unsafe_MixedSetter_addonAfter_select: 'SlotSetter',
                                    _unsafe_MixedSetter_addonBefore_select: 'SlotSetter',
                                  },
                                }}
                                __component_name="FormilyNumberPicker"
                              />
                            </Space>
                          </FormilyFormItem>
                          <FormilyFormItem
                            style={{}}
                            fieldProps={{
                              name: 'filter',
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
                                    {this.i18n('i18n-5bcb4vh8') /* 仓库组件过滤 */}
                                  </Typography.Text>
                                  <Tooltip
                                    title={
                                      this.i18n(
                                        'i18n-y1e6lwsu'
                                      ) /* 未进行过滤设置的组件将保留其全部版本 */
                                    }
                                    __component_name="Tooltip"
                                  >
                                    <Container
                                      color="colorTextDescription"
                                      __component_name="Container"
                                    >
                                      <AntdIconQuestionCircleOutlined
                                        style={{ top: '2px', color: '', position: 'relative' }}
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
                            decoratorProps={{
                              'x-decorator-props': { wrapperWidth: '850px', labelEllipsis: false },
                            }}
                            __component_name="FormilyFormItem"
                          >
                            <FormilyArrayTable
                              fieldProps={{ name: 'value', type: 'array', 'x-validator': [] }}
                              __component_name="FormilyArrayTable"
                              decoratorProps={{ 'x-decorator-props': { labelEllipsis: true } }}
                            >
                              <FormilyArrayTable.Column
                                title={this.i18n('i18n-cuf6u4di') /* 组件名称 */}
                                __component_name="FormilyArrayTable.Column"
                              >
                                <FormilyInput
                                  style={{}}
                                  fieldProps={{
                                    name: 'name',
                                    required: true,
                                    'x-validator': [
                                      {
                                        id: 'disabled',
                                        type: 'disabled',
                                        message:
                                          this.i18n(
                                            'i18n-hzu1j2jl'
                                          ) /* 由3~63个小写字母、数字、中划线“-”或点“.”组成，并以字母、数字开头或结尾 */,
                                        pattern: __$$eval(() =>
                                          this.utils.getNameReg({
                                            max: 63,
                                          })
                                        ),
                                        children: '未知',
                                        required: false,
                                      },
                                      {
                                        id: 'disabled',
                                        type: 'disabled',
                                        message: '',
                                        children: '未知',
                                        validator: function () {
                                          return this.validatorComponentName.apply(
                                            this,
                                            Array.prototype.slice.call(arguments).concat([])
                                          );
                                        }.bind(this),
                                        _unsafe_MixedSetter_message_select: 'StringSetter',
                                      },
                                    ],
                                  }}
                                  componentProps={{
                                    'x-component-props': {
                                      placeholder:
                                        this.i18n('i18n-zz8l4ytx') /* 请填写完整的组件名称 */,
                                    },
                                  }}
                                  __component_name="FormilyInput"
                                />
                              </FormilyArrayTable.Column>
                              <FormilyArrayTable.Column
                                title={this.i18n('i18n-xw5z4b0a') /* 废弃版本 */}
                                __component_name="FormilyArrayTable.Column"
                              >
                                <FormilySelect
                                  fieldProps={{
                                    enum: [
                                      {
                                        id: 'disabled',
                                        type: 'disabled',
                                        label: this.i18n('i18n-r1zean6b') /* 保留 */,
                                        value: 'true',
                                        children: '',
                                      },
                                      {
                                        id: 'disabled',
                                        type: 'disabled',
                                        label: this.i18n('i18n-54cgv8pm') /* 过滤 */,
                                        value: 'false',
                                        children: '',
                                      },
                                    ],
                                    name: 'keepDeprecated',
                                    default: 'true',
                                    'x-validator': [],
                                  }}
                                  componentProps={{
                                    'x-component-props': {
                                      disabled: false,
                                      allowClear: false,
                                      placeholder: this.i18n('i18n-fald39iq') /* 请选择 */,
                                      _sdkSwrGetFunc: {},
                                    },
                                  }}
                                  __component_name="FormilySelect"
                                />
                              </FormilyArrayTable.Column>
                              <FormilyArrayTable.Column
                                title={this.i18n('i18n-ufn05c8r') /* 正常版本 */}
                                __component_name="FormilyArrayTable.Column"
                              >
                                <Space
                                  align="center"
                                  direction="horizontal"
                                  __component_name="Space"
                                >
                                  <FormilySelect
                                    fieldProps={{
                                      enum: [
                                        {
                                          id: 'disabled',
                                          type: 'disabled',
                                          label: this.i18n('i18n-r4pp6mwv') /* 全部过滤 */,
                                          value: 'ignore_all',
                                          children: '',
                                        },
                                        {
                                          id: 'disabled',
                                          type: 'disabled',
                                          label: this.i18n('i18n-or6btdf3') /* 精确过滤 */,
                                          value: 'ignore_exact',
                                          children: '',
                                        },
                                        {
                                          id: 'disabled',
                                          type: 'disabled',
                                          label: this.i18n('i18n-ndhridkq') /* 精确保留 */,
                                          value: 'keep_exact',
                                          children: '',
                                        },
                                      ],
                                      name: 'operation',
                                      default: 'ignore_all',
                                      'x-validator': [
                                        {
                                          id: 'disabled',
                                          type: 'disabled',
                                          children: '未知',
                                          validator: function () {
                                            return this.validatorDisabled.apply(
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
                                        placeholder: this.i18n('i18n-fald39iq') /* 请选择 */,
                                        _sdkSwrGetFunc: {},
                                      },
                                    }}
                                    decoratorProps={{
                                      'x-decorator-props': {
                                        colon: false,
                                        tooltip: '',
                                        asterisk: false,
                                      },
                                    }}
                                    __component_name="FormilySelect"
                                  />
                                  <FormilyInput
                                    style={{}}
                                    fieldProps={{
                                      name: 'versions',
                                      'x-pattern': 'disabled',
                                      'x-validator': [],
                                    }}
                                    componentProps={{
                                      'x-component-props': {
                                        placeholder:
                                          this.i18n('i18n-e4qgvfg7') /* 请完整填写版本 */,
                                      },
                                    }}
                                    __component_name="FormilyInput"
                                  />
                                  <FormilyInput
                                    style={{}}
                                    fieldProps={{
                                      name: 'regexp',
                                      'x-pattern': 'disabled',
                                      'x-validator': [],
                                    }}
                                    componentProps={{
                                      'x-component-props': {
                                        placeholder:
                                          this.i18n('i18n-7b4geri9') /* 请填写版本正则表达式 */,
                                      },
                                    }}
                                    __component_name="FormilyInput"
                                  />
                                  <FormilyInput
                                    style={{}}
                                    fieldProps={{
                                      name: 'versionConstraint',
                                      'x-pattern': 'disabled',
                                      'x-validator': [],
                                    }}
                                    componentProps={{
                                      'x-component-props': {
                                        placeholder:
                                          this.i18n('i18n-hve94tyf') /* 请填写版本约束条件 */,
                                      },
                                    }}
                                    __component_name="FormilyInput"
                                  />
                                </Space>
                              </FormilyArrayTable.Column>
                              <FormilyArrayTable.Operation
                                title={this.i18n('i18n-ioy0ge9h') /* 操作 */}
                                width={50}
                                __component_name="FormilyArrayTable.Operation"
                              />
                              <FormilyArrayTable.Addition
                                title={this.i18n('i18n-1vi37ku6') /* 添加 */}
                                __component_name="FormilyArrayTable.Addition"
                              />
                            </FormilyArrayTable>
                          </FormilyFormItem>
                        </Col>
                      </Row>,
                      <Row wrap={true} style={{}} __component_name="Row" key="node_oclkjh34mr1">
                        <Col span={24} __component_name="Col">
                          <FormilyFormItem
                            style={{}}
                            fieldProps={{
                              name: 'imageOverride',
                              title: this.i18n('i18n-guv8z978') /* 镜像仓库替换 */,
                              'x-component': 'FormilyFormItem',
                              'x-validator': [],
                            }}
                            decoratorProps={{
                              'x-decorator-props': {
                                style: { marginTop: '10px' },
                                wrapperWidth: '850px',
                                labelEllipsis: true,
                              },
                            }}
                            __component_name="FormilyFormItem"
                          >
                            <FormilyArrayCards
                              fieldProps={{
                                name: 'value',
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
                              decoratorProps={{
                                'x-decorator-props': {
                                  style: {},
                                  wrapperWidth: '',
                                  labelEllipsis: true,
                                },
                              }}
                              __component_name="FormilyArrayCards"
                            >
                              <Space
                                size={30}
                                align="center"
                                style={{
                                  display: 'flex',
                                  alignItems: 'baseline',
                                  marginRight: '0px',
                                }}
                                direction="horizontal"
                                __component_name="Space"
                              >
                                <Space
                                  align="center"
                                  style={{ display: 'flex', alignItems: 'baseline' }}
                                  direction="horizontal"
                                  __component_name="Space"
                                >
                                  <FormilyInput
                                    fieldProps={{
                                      name: 'registry',
                                      title: '',
                                      required: true,
                                      'x-validator': [
                                        {
                                          id: 'disabled',
                                          type: 'disabled',
                                          children: '未知',
                                          validator: function () {
                                            return this.validatorDomainName.apply(
                                              this,
                                              Array.prototype.slice.call(arguments).concat([])
                                            );
                                          }.bind(this),
                                        },
                                      ],
                                    }}
                                    componentProps={{
                                      'x-component-props': {
                                        placeholder: this.i18n('i18n-msztcfd3') /* 请输入原域名 */,
                                      },
                                    }}
                                    __component_name="FormilyInput"
                                    decoratorProps={{
                                      'x-decorator-props': { labelEllipsis: true },
                                    }}
                                  />
                                  <Typography.Text
                                    style={{ fontSize: '', verticalAlign: 'bas' }}
                                    strong={false}
                                    disabled={false}
                                    ellipsis={true}
                                    __component_name="Typography.Text"
                                  >
                                    /
                                  </Typography.Text>
                                  <FormilyInput
                                    fieldProps={{
                                      name: 'path',
                                      title: '',
                                      required: true,
                                      'x-validator': [
                                        {
                                          id: 'disabled',
                                          type: 'disabled',
                                          message: '',
                                          children: '未知',
                                          validator: function () {
                                            return this.validatorRepoName.apply(
                                              this,
                                              Array.prototype.slice.call(arguments).concat([])
                                            );
                                          }.bind(this),
                                        },
                                      ],
                                    }}
                                    componentProps={{
                                      'x-component-props': {
                                        placeholder:
                                          this.i18n('i18n-8im5lu89') /* 请输入原仓库组 */,
                                      },
                                    }}
                                    decoratorProps={{
                                      'x-decorator-props': { labelEllipsis: true },
                                    }}
                                    __component_name="FormilyInput"
                                  />
                                </Space>
                                <Typography.Text
                                  style={{ fontSize: '', verticalAlign: 'bas' }}
                                  strong={false}
                                  disabled={false}
                                  ellipsis={true}
                                  __component_name="Typography.Text"
                                >
                                  {this.i18n('i18n-xeckog8e') /* 替换为 */}
                                </Typography.Text>
                                <Space
                                  align="center"
                                  style={{ display: 'flex', alignItems: 'baseline' }}
                                  direction="horizontal"
                                  __component_name="Space"
                                >
                                  <FormilyInput
                                    fieldProps={{
                                      name: 'newRegistry',
                                      title: '',
                                      required: true,
                                      'x-validator': [
                                        {
                                          id: 'disabled',
                                          children: '未知',
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
                                    componentProps={{
                                      'x-component-props': {
                                        placeholder: this.i18n('i18n-hoamre8k') /* 请输入新域名 */,
                                      },
                                    }}
                                    __component_name="FormilyInput"
                                    decoratorProps={{
                                      'x-decorator-props': { labelEllipsis: true },
                                    }}
                                  />
                                  <Typography.Text
                                    style={{ fontSize: '', verticalAlign: 'bas' }}
                                    strong={false}
                                    disabled={false}
                                    ellipsis={true}
                                    __component_name="Typography.Text"
                                  >
                                    /
                                  </Typography.Text>
                                  <FormilyInput
                                    fieldProps={{
                                      name: 'newPath',
                                      title: '',
                                      required: true,
                                      'x-validator': [
                                        {
                                          id: 'disabled',
                                          children: '未知',
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
                                    componentProps={{
                                      'x-component-props': {
                                        placeholder:
                                          this.i18n('i18n-jwjqcqiq') /* 请输入新仓库组 */,
                                      },
                                    }}
                                    __component_name="FormilyInput"
                                    decoratorProps={{
                                      'x-decorator-props': { labelEllipsis: true },
                                    }}
                                  />
                                </Space>
                              </Space>
                            </FormilyArrayCards>
                          </FormilyFormItem>
                          {!!false && (
                            <FormilySwitch
                              fieldProps={{
                                name: 'pc',
                                title: this.i18n('i18n-thxp526w') /* 组件评测 */,
                                description:
                                  this.i18n(
                                    'i18n-hm90oqjw'
                                  ) /* 开启后，进入组件市场，对仓库内组件发起评测。将从安全性、可靠性、可用性三个方面对组件给出评测结果及建议，供您参考 */,
                                'x-validator': [],
                              }}
                              componentProps={{
                                'x-component-props': { loading: false, disabled: false },
                              }}
                              decoratorProps={{ 'x-decorator-props': { labelEllipsis: true } }}
                              __component_name="FormilySwitch"
                            />
                          )}
                        </Col>
                      </Row>,
                    ],
                  ]}
                  children=""
                  defaultOpen={__$$eval(() => this.props.appHelper?.match?.params?.id !== 'create')}
                  orientation="left"
                  __component_name="Divider"
                  orientationMargin={0}
                >
                  <Typography.Text
                    type="colorPrimary"
                    style={{ top: '2px', fontSize: '', position: 'relative' }}
                    strong={false}
                    disabled={false}
                    ellipsis={true}
                    __component_name="Typography.Text"
                  >
                    {this.i18n('i18n-4wrnn3o8') /* 高级配置 */}
                  </Typography.Text>
                </Divider>
                <Divider
                  mode="line"
                  style={{ width: 'calc(100% + 48px)', marginLeft: '-24px' }}
                  dashed={false}
                  defaultOpen={false}
                  __component_name="Divider"
                />
                <FormilyFormItem
                  fieldProps={{
                    name: 'FormilyFormItem1',
                    title: '',
                    'x-component': 'FormilyFormItem',
                    'x-validator': [],
                    _unsafe_MixedSetter_title_select: 'SlotSetter',
                  }}
                  __component_name="FormilyFormItem"
                  decoratorProps={{ 'x-decorator-props': { labelEllipsis: true } }}
                >
                  <Space align="center" direction="horizontal" __component_name="Space">
                    <Button
                      block={false}
                      ghost={false}
                      shape="default"
                      style={{ marginLeft: '145px' }}
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
  const match = matchPath({ path: '/components/warehouse/:id' }, location.pathname);
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
        <ComponentsWarehouseCreate$$Page {...dataProps} self={self} appHelper={appHelper} />
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
