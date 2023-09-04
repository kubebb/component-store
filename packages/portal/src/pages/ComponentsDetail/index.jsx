// 注意: 出码引擎注入的临时变量默认都以 "__$$" 开头，禁止在搭建的代码中直接访问。
// 例外：react 框架的导出名和各种组件名除外。
import React from 'react';

import {
  Alert,
  Anchor,
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  Dropdown,
  Image,
  Modal,
  Page,
  Row,
  Space,
  Tag,
  Tooltip,
  Typography,
} from '@tenx-ui/materials';

import {
  AntdIconDownOutlined,
  AntdIconExpandOutlined,
  AntdIconHomeOutlined,
} from '@tenx-ui/icon-materials';

import { getUnifiedHistory } from '@tenx-ui/utils/es/UnifiedLink/index.prod';
import { matchPath, useLocation } from '@umijs/max';
import qs from 'query-string';
import DataProvider from '../../components/DataProvider';

import utils from '../../utils/__utils';

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

    __$$i18n._inject2(this);

    this.state = {
      cluster: undefined,
      version: undefined,
      modalType: 'delete',
      isOpenModal: false,
      modalLoading: false,
    };
  }

  $ = () => null;

  $$ = () => [];

  closeModal() {
    this.setState({
      isOpenModal: false,
    });
  }

  getCluster() {
    const cluster = this.appHelper?.history?.query?.cluster;
    return cluster;
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

  getContainer() {
    return window;
  }

  handleRefresh() {
    this.props.useGetComponent.mutate();
  }

  getClusterInfo() {
    return this.state.cluster;
  }

  getVersionInfo() {
    return (
      this.props.useGetComponent?.data?.component?.versions.find(item => {
        return item.version === this.state.version;
      }) || this.props.useGetComponent?.data?.component?.versions?.[0]
    );
  }

  openDeleteModal() {
    this.setState({
      isOpenModal: true,
    });
  }

  getCurrentAnchor(activeLink) {
    return activeLink || '#description';
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

  handleOprationBtnClick(e) {
    const pre = this.appHelper?.location?.pathname?.split('/')?.slice(0, 4)?.join('/');
    this.history.push(
      `${pre}/management-action/install/${
        this.props.useGetComponent?.data?.component?.name
      }?cluster=${this.getCluster()}`
    );
  }

  handleVersionMenuClick(e) {
    this.setState({
      version: e.key,
    });
  }

  async handleOprationMenuClick(e) {
    if (e?.key === 'subscription') {
      const pre = this.appHelper?.location?.pathname?.split('/')?.slice(0, 4)?.join('/');
      this.history.push(
        `${pre}/management-action/subscription/${
          this.props.useGetComponent?.data?.component?.name
        }?cluster=${this.getCluster()}`
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

  componentDidMount() {
    this.loadCluster();
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
          title={this.i18n('i18n-p9k8gbed') /* 删除组件版本 */}
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
            message={[
              !!__$$eval(
                () => this.props.useGetComponent?.data?.component?.versions?.length > 1
              ) && (
                <Space
                  align="center"
                  direction="horizontal"
                  __component_name="Space"
                  key="node_ocllukbnzp6"
                >
                  <Typography.Text
                    style={{ fontSize: '' }}
                    strong={false}
                    disabled={false}
                    ellipsis={true}
                    __component_name="Typography.Text"
                  >
                    {this.i18n('i18n-2kvb9vmj') /* 确定删除当前组件的 */}
                  </Typography.Text>
                  <Typography.Text
                    style={{ fontSize: '' }}
                    strong={false}
                    disabled={false}
                    ellipsis={true}
                    __component_name="Typography.Text"
                  >
                    {__$$eval(() => this.getVersionInfo()?.version || '-')}
                  </Typography.Text>
                  <Typography.Text
                    style={{ fontSize: '' }}
                    strong={false}
                    disabled={false}
                    ellipsis={true}
                    __component_name="Typography.Text"
                  >
                    {this.i18n('i18n-fcs6dou2') /* 版本吗？ */}
                  </Typography.Text>
                </Space>
              ),
              !!__$$eval(
                () => this.props.useGetComponent?.data?.component?.versions?.length < 2
              ) && (
                <Space
                  align="center"
                  direction="horizontal"
                  __component_name="Space"
                  key="node_ocllukbnzp1"
                >
                  <Typography.Text
                    style={{ fontSize: '' }}
                    strong={false}
                    disabled={false}
                    ellipsis={true}
                    __component_name="Typography.Text"
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
                  align="center"
                  direction="horizontal"
                  __component_name="Space"
                  key="node_ocllukbnzpa"
                >
                  <Typography.Text
                    style={{ fontSize: '' }}
                    strong={false}
                    disabled={false}
                    ellipsis={true}
                    __component_name="Typography.Text"
                  >
                    {this.i18n('i18n-l5mx5mvn') /* 确定删除版本 */}
                  </Typography.Text>
                  <Typography.Text
                    style={{ fontSize: '' }}
                    strong={false}
                    disabled={false}
                    ellipsis={true}
                    __component_name="Typography.Text"
                  >
                    {__$$eval(() => this.getVersionInfo()?.version || '-')}
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
              ),
            ]}
            showIcon={true}
            __component_name="Alert"
          />
        </Modal>
        <Row wrap={true} __component_name="Row">
          <Col span={24} __component_name="Col">
            <Space align="center" direction="horizontal">
              <Button.Back
                type="primary"
                title={this.i18n('i18n-00cyzhs8') /* 组件详情 */}
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
              }}
              closable={false}
              __component_name="Tag"
            >
              {this.i18n('i18n-yfkq2xqq') /* 集群 */}
            </Tag>
            <Tag
              color="default"
              style={{ position: 'relative', marginTop: '-5px', borderRadius: '0' }}
              closable={false}
              __component_name="Tag"
            >
              {__$$eval(() => this.getClusterInfo()?.fullName || '-')}
            </Tag>
          </Col>
          <Col span={24} __component_name="Col">
            <Card
              size="default"
              type="inner"
              actions={[]}
              loading={false}
              bordered={false}
              hoverable={false}
              __component_name="Card"
            >
              <Row wrap={false} __component_name="Row">
                <Col
                  flex="80px"
                  style={{ display: 'flex', alignItems: 'center' }}
                  __component_name="Col"
                >
                  <Image
                    src={__$$eval(() => this.props.useGetComponent?.data?.component?.icon || '-')}
                    width={40}
                    height={40}
                    preview={false}
                    fallback=""
                    __component_name="Image"
                  />
                </Col>
                <Col flex="auto" __component_name="Col">
                  <Row wrap={false} __component_name="Row">
                    <Col flex="auto" __component_name="Col">
                      <Row wrap={true} gutter={[0, 0]} __component_name="Row">
                        <Col span={24} __component_name="Col">
                          <Row wrap={false} style={{ paddingTop: '4px' }} __component_name="Row">
                            <Col
                              flex=""
                              style={{ maxWidth: 'calc(100% - 100px)' }}
                              __component_name="Col"
                            >
                              <Typography.Text
                                style={{ fontSize: '18px' }}
                                strong={true}
                                disabled={false}
                                ellipsis={true}
                                __component_name="Typography.Text"
                              >
                                {__$$eval(
                                  () =>
                                    this.props.useGetComponent?.data?.component?.chartName || '-'
                                )}
                              </Typography.Text>
                            </Col>
                            <Col flex="auto" __component_name="Col">
                              {!!__$$eval(
                                () =>
                                  (new Date().getTime() -
                                    new Date(
                                      this.props.useGetComponent?.data?.component?.updatedAt
                                    ).getTime()) /
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
                              {!!false && (
                                <Tag
                                  color={__$$eval(
                                    () =>
                                      this.utils
                                        .getComponentTypes(this, false, true)
                                        ?.find(item => item.value === 'ky')?.color || 'default'
                                  )}
                                  closable={false}
                                  __component_name="Tag"
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
                        <Col span={24} __component_name="Col">
                          <Space align="center" style={{ display: 'flex' }} direction="horizontal">
                            <Tooltip title="提示内容" __component_name="Tooltip">
                              <Dropdown
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
                                trigger={['hover']}
                                disabled={false}
                                placement="bottomLeft"
                                __component_name="Dropdown"
                                destroyPopupOnHide={true}
                              >
                                <Button
                                  type="link"
                                  block={false}
                                  ghost={false}
                                  shape="default"
                                  style={{
                                    paddingTop: '0px',
                                    paddingLeft: '8px',
                                    paddingRight: '0px',
                                    paddingBottom: '0px',
                                  }}
                                  danger={false}
                                  disabled={false}
                                  __component_name="Button"
                                >
                                  {[
                                    <Typography.Text
                                      style={{ color: 'inherit', fontSize: '' }}
                                      strong={false}
                                      disabled={false}
                                      __component_name="Typography.Text"
                                      key="node_oclkm7vpnx4s"
                                    >
                                      {__$$eval(() => this.getVersionInfo()?.version || '-')}
                                    </Typography.Text>,
                                    <AntdIconDownOutlined
                                      style={{ fontSize: '10px', marginLeft: '12px' }}
                                      __component_name="AntdIconDownOutlined"
                                      key="node_oclkm7vpnx4t"
                                    />,
                                  ]}
                                </Button>
                                <Divider
                                  mode="expanded"
                                  dashed={true}
                                  content={[null]}
                                  defaultOpen={true}
                                  orientation="left"
                                  __component_name="Divider"
                                  orientationMargin={0}
                                >
                                  高级配置
                                </Divider>
                                <Divider
                                  mode="line"
                                  dashed={false}
                                  defaultOpen={false}
                                  __component_name="Divider"
                                />
                                <Divider
                                  mode="line"
                                  dashed={false}
                                  defaultOpen={false}
                                  __component_name="Divider"
                                />
                              </Dropdown>
                            </Tooltip>
                            <Divider
                              mode="default"
                              type="vertical"
                              dashed={false}
                              defaultOpen={false}
                              __component_name="Divider"
                            />
                            <Tooltip
                              title={this.i18n('i18n-1po87kgw') /* 组件仓库 */}
                              __component_name="Tooltip"
                            >
                              <AntdIconHomeOutlined
                                style={{ top: '3px', color: '#000000a6', position: 'relative' }}
                                __component_name="AntdIconHomeOutlined"
                              />
                            </Tooltip>
                            <Typography.Text
                              style={{ fontSize: '' }}
                              strong={false}
                              disabled={false}
                              ellipsis={false}
                              __component_name="Typography.Text"
                            >
                              {__$$eval(
                                () => this.props.useGetComponent?.data?.component?.repository || '-'
                              )}
                            </Typography.Text>
                            <Divider
                              mode="default"
                              type="vertical"
                              dashed={false}
                              defaultOpen={false}
                              __component_name="Divider"
                            />
                            <Tooltip
                              title={this.i18n('i18n-02hvitqg') /* 关键字 */}
                              __component_name="Tooltip"
                            >
                              <AntdIconExpandOutlined
                                style={{ top: '3px', color: '#000000a6', position: 'relative' }}
                                __component_name="AntdIconExpandOutlined"
                              />
                            </Tooltip>
                            <Typography.Text
                              style={{ fontSize: '' }}
                              strong={false}
                              disabled={false}
                              ellipsis={true}
                              __component_name="Typography.Text"
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
                      flex="160px"
                      style={{ display: 'flex', alignItems: 'center' }}
                      __component_name="Col"
                    >
                      <Space align="center" direction="horizontal" __component_name="Space">
                        {!!__$$eval(
                          () =>
                            !this.props.appHelper?.match?.pathname?.startsWith('/components/market')
                        ) && (
                          <Button
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
                        )}
                        {!!__$$eval(() =>
                          this.props.appHelper?.match?.pathname?.startsWith(
                            '/components/management/publish'
                          )
                        ) && (
                          <Button
                            type="default"
                            block={false}
                            ghost={false}
                            shape="default"
                            danger={true}
                            onClick={function () {
                              return this.openDeleteModal.apply(
                                this,
                                Array.prototype.slice.call(arguments).concat([])
                              );
                            }.bind(this)}
                            disabled={false}
                            __component_name="Button"
                          >
                            {this.i18n('i18n-l5zu1evc') /* 删除版本 */}
                          </Button>
                        )}
                      </Space>
                      {!!__$$eval(() =>
                        this.props.appHelper?.match?.pathname?.startsWith('/components/market')
                      ) && (
                        <Dropdown.Button
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
                          style={{}}
                          danger={false}
                          onClick={function () {
                            return this.handleOprationBtnClick.apply(
                              this,
                              Array.prototype.slice.call(arguments).concat([])
                            );
                          }.bind(this)}
                          trigger={['hover']}
                          disabled={false}
                          placement="bottomRight"
                          __component_name="Dropdown.Button"
                          destroyPopupOnHide={true}
                        >
                          <Typography.Text
                            style={{ fontSize: '' }}
                            strong={false}
                            disabled={false}
                            ellipsis={true}
                            __component_name="Typography.Text"
                          >
                            {this.i18n('i18n-s827y1s8') /* 安装 */}
                          </Typography.Text>
                        </Dropdown.Button>
                      )}
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Card>
          </Col>
          <Col span={24} __component_name="Col">
            <Card
              size="default"
              type="inner"
              actions={[]}
              loading={__$$eval(
                () =>
                  this.props.useGetComponent?.isLoading ||
                  this.props?.useGetComponent?.loading ||
                  false
              )}
              bordered={false}
              hoverable={false}
              __component_name="Card"
            >
              <Anchor
                items={[
                  {
                    key: 'description',
                    href: '#description',
                    title: this.i18n('i18n-f6e39rd6') /* 产品介绍 */,
                  },
                  {
                    key: 'versions',
                    href: '#versions',
                    title: this.i18n('i18n-7e7t3bw9') /* 版本 */,
                  },
                  {
                    key: 'maintainers',
                    href: '#maintainers',
                    title: this.i18n('i18n-xaa077da') /* 维护者信息 */,
                  },
                ]}
                style={{ marginBottom: '32px' }}
                direction="horizontal"
                getContainer={function () {
                  return this.getContainer.apply(
                    this,
                    Array.prototype.slice.call(arguments).concat([])
                  );
                }.bind(this)}
                __component_name="Anchor"
                getCurrentAnchor={function () {
                  return this.getCurrentAnchor.apply(
                    this,
                    Array.prototype.slice.call(arguments).concat([])
                  );
                }.bind(this)}
              />
              <Descriptions
                id="description"
                size="small"
                colon={false}
                items={[
                  {
                    key: 'pi5m3iilqxj',
                    span: 1,
                    label: this.i18n('i18n-fm60ewc6') /* 组件描述 */,
                    children: (
                      <Typography.Text
                        style={{ fontSize: '' }}
                        strong={false}
                        disabled={false}
                        ellipsis={true}
                        __component_name="Typography.Text"
                      >
                        {__$$eval(
                          () => this.props.useGetComponent?.data?.component?.description || '-'
                        )}
                      </Typography.Text>
                    ),
                  },
                  {
                    key: 'et5s0offl7d',
                    span: 1,
                    label: this.i18n('i18n-wuup4l9q') /* 组件创建时间 */,
                    children: (
                      <Typography.Time
                        time={__$$eval(
                          () => this.props.useGetComponent?.data?.component?.creationTimestamp
                        )}
                        format=""
                        relativeTime={false}
                        __component_name="Typography.Time"
                      />
                    ),
                  },
                  {
                    key: '672hupxnu9c',
                    span: 1,
                    label: this.i18n('i18n-j1vviznx') /* 组件更新时间 */,
                    children: (
                      <Typography.Time
                        time={__$$eval(
                          () => this.props.useGetComponent?.data?.component?.updatedAt
                        )}
                        format=""
                        relativeTime={false}
                        __component_name="Typography.Time"
                      />
                    ),
                  },
                  {
                    key: 'apettitpge7',
                    span: 1,
                    label: this.i18n('i18n-f34yu3md') /* 组件官网 */,
                    children: (
                      <Typography.Text
                        style={{ fontSize: '' }}
                        strong={false}
                        disabled={false}
                        ellipsis={true}
                        __component_name="Typography.Text"
                      >
                        {__$$eval(() => this.props.useGetComponent?.data?.component?.home || '-')}
                      </Typography.Text>
                    ),
                  },
                  {
                    key: '636ln138sl7',
                    span: 1,
                    label: this.i18n('i18n-yzkyg961') /* 源代码地址 */,
                    children: (
                      <Row wrap={true} gutter={[0, 0]} __component_name="Row">
                        {__$$evalArray(
                          () => this.props.useGetComponent?.data?.component?.sources || []
                        ).map((item, index) =>
                          (__$$context => (
                            <Col span={24} __component_name="Col">
                              <Typography.Text
                                style={{ width: '800px' }}
                                strong={false}
                                copyable={{
                                  text: __$$eval(() => item),
                                  _unsafe_MixedSetter_text_select: 'VariableSetter',
                                }}
                                disabled={false}
                                ellipsis={true}
                                __component_name="Typography.Text"
                              >
                                {__$$eval(() => item)}
                              </Typography.Text>
                            </Col>
                          ))(__$$createChildContext(__$$context, { item, index }))
                        )}
                      </Row>
                    ),
                  },
                ]}
                title={this.i18n('i18n-f6e39rd6') /* 产品介绍 */}
                column={1}
                layout="vertical"
                bordered={false}
                labelStyle={{ width: 100 }}
                borderedBottom={false}
                __component_name="Descriptions"
                borderedBottomDashed={false}
              >
                <Descriptions.Item
                  key="pi5m3iilqxj"
                  span={1}
                  label={this.i18n('i18n-fm60ewc6') /* 组件描述 */}
                >
                  {
                    <Typography.Text
                      style={{ fontSize: '' }}
                      strong={false}
                      disabled={false}
                      ellipsis={true}
                      __component_name="Typography.Text"
                    >
                      {__$$eval(
                        () => this.props.useGetComponent?.data?.component?.description || '-'
                      )}
                    </Typography.Text>
                  }
                </Descriptions.Item>
                <Descriptions.Item
                  key="et5s0offl7d"
                  span={1}
                  label={this.i18n('i18n-wuup4l9q') /* 组件创建时间 */}
                >
                  {
                    <Typography.Time
                      time={__$$eval(
                        () => this.props.useGetComponent?.data?.component?.creationTimestamp
                      )}
                      format=""
                      relativeTime={false}
                      __component_name="Typography.Time"
                    />
                  }
                </Descriptions.Item>
                <Descriptions.Item
                  key="672hupxnu9c"
                  span={1}
                  label={this.i18n('i18n-j1vviznx') /* 组件更新时间 */}
                >
                  {
                    <Typography.Time
                      time={__$$eval(() => this.props.useGetComponent?.data?.component?.updatedAt)}
                      format=""
                      relativeTime={false}
                      __component_name="Typography.Time"
                    />
                  }
                </Descriptions.Item>
                <Descriptions.Item
                  key="apettitpge7"
                  span={1}
                  label={this.i18n('i18n-f34yu3md') /* 组件官网 */}
                >
                  {
                    <Typography.Text
                      style={{ fontSize: '' }}
                      strong={false}
                      disabled={false}
                      ellipsis={true}
                      __component_name="Typography.Text"
                    >
                      {__$$eval(() => this.props.useGetComponent?.data?.component?.home || '-')}
                    </Typography.Text>
                  }
                </Descriptions.Item>
                <Descriptions.Item
                  key="636ln138sl7"
                  span={1}
                  label={this.i18n('i18n-yzkyg961') /* 源代码地址 */}
                >
                  {
                    <Row wrap={true} gutter={[0, 0]} __component_name="Row">
                      {__$$evalArray(
                        () => this.props.useGetComponent?.data?.component?.sources || []
                      ).map((item, index) =>
                        (__$$context => (
                          <Col span={24} __component_name="Col">
                            <Typography.Text
                              style={{ width: '800px' }}
                              strong={false}
                              copyable={{
                                text: __$$eval(() => item),
                                _unsafe_MixedSetter_text_select: 'VariableSetter',
                              }}
                              disabled={false}
                              ellipsis={true}
                              __component_name="Typography.Text"
                            >
                              {__$$eval(() => item)}
                            </Typography.Text>
                          </Col>
                        ))(__$$createChildContext(__$$context, { item, index }))
                      )}
                    </Row>
                  }
                </Descriptions.Item>
              </Descriptions>
              <Descriptions
                id="versions"
                size="small"
                colon={false}
                items={[
                  {
                    key: 'pi5m3iilqxj',
                    span: 1,
                    label: this.i18n('i18n-ekp8efeq') /* 组件版本 */,
                    children: (
                      <Typography.Text
                        style={{ fontSize: '' }}
                        strong={false}
                        disabled={false}
                        ellipsis={true}
                        __component_name="Typography.Text"
                      >
                        {__$$eval(() => this.getVersionInfo()?.version || '-')}
                      </Typography.Text>
                    ),
                  },
                  {
                    key: '8ju3wht9i04',
                    span: 1,
                    label: this.i18n('i18n-xx4ved6h') /* 各应用版本 */,
                    children: (
                      <Typography.Text
                        style={{ fontSize: '' }}
                        strong={false}
                        disabled={false}
                        ellipsis={true}
                        __component_name="Typography.Text"
                      >
                        {__$$eval(() => this.getVersionInfo()?.appVersion || '-')}
                      </Typography.Text>
                    ),
                  },
                ]}
                style={{ marginTop: '24px', marginBottom: '24px' }}
                title={this.i18n('i18n-7e7t3bw9') /* 版本 */}
                column={1}
                layout="vertical"
                bordered={false}
                labelStyle={{ width: 100 }}
                borderedBottom={false}
                __component_name="Descriptions"
                borderedBottomDashed={false}
              >
                <Descriptions.Item
                  key="pi5m3iilqxj"
                  span={1}
                  label={this.i18n('i18n-ekp8efeq') /* 组件版本 */}
                >
                  {
                    <Typography.Text
                      style={{ fontSize: '' }}
                      strong={false}
                      disabled={false}
                      ellipsis={true}
                      __component_name="Typography.Text"
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
                  span={1}
                  label={this.i18n('i18n-xx4ved6h') /* 各应用版本 */}
                >
                  {
                    <Typography.Text
                      style={{ fontSize: '' }}
                      strong={false}
                      disabled={false}
                      ellipsis={true}
                      __component_name="Typography.Text"
                    >
                      {__$$eval(() => this.getVersionInfo()?.appVersion || '-')}
                    </Typography.Text>
                  }
                </Descriptions.Item>
              </Descriptions>
              <Typography.Title
                bold={true}
                level={2}
                style={{}}
                bordered={false}
                ellipsis={true}
                __component_name="Typography.Title"
              >
                {this.i18n('i18n-xaa077da') /* 维护者信息 */}
              </Typography.Title>
              {__$$evalArray(
                () => this.props.useGetComponent?.data?.component?.maintainers || []
              ).map((item, index) =>
                (__$$context => (
                  <Descriptions
                    id="maintainers"
                    size="small"
                    colon={false}
                    items={[
                      {
                        key: 'pi5m3iilqxj',
                        span: 1,
                        label: this.i18n('i18n-xql84ibj') /* 姓名 */,
                        children: (
                          <Typography.Text
                            style={{ fontSize: '' }}
                            strong={false}
                            disabled={false}
                            ellipsis={true}
                            __component_name="Typography.Text"
                          >
                            {__$$eval(() => item?.name || '-')}
                          </Typography.Text>
                        ),
                      },
                      {
                        key: '3v0s08uuplw',
                        span: 1,
                        label: this.i18n('i18n-3szzvcl7') /* 邮箱 */,
                        children: (
                          <Typography.Text
                            style={{ fontSize: '' }}
                            strong={false}
                            disabled={false}
                            ellipsis={true}
                            __component_name="Typography.Text"
                          >
                            {__$$eval(() => item?.email || '-')}
                          </Typography.Text>
                        ),
                      },
                      {
                        key: 'plk75u4i8vt',
                        span: 1,
                        label: this.i18n('i18n-2lcystak') /* 网站 */,
                        children: (
                          <Typography.Text
                            style={{ width: '800px', fontSize: '' }}
                            strong={false}
                            disabled={false}
                            ellipsis={true}
                            __component_name="Typography.Text"
                          >
                            {__$$eval(() => item?.url || '-')}
                          </Typography.Text>
                        ),
                      },
                    ]}
                    title=""
                    column={1}
                    layout="vertical"
                    bordered={false}
                    labelStyle={{ width: 100 }}
                    borderedBottom={false}
                    __component_name="Descriptions"
                    borderedBottomDashed={false}
                  >
                    <Descriptions.Item
                      key="pi5m3iilqxj"
                      span={1}
                      label={this.i18n('i18n-xql84ibj') /* 姓名 */}
                    >
                      {
                        <Typography.Text
                          style={{ fontSize: '' }}
                          strong={false}
                          disabled={false}
                          ellipsis={true}
                          __component_name="Typography.Text"
                        >
                          {__$$eval(() => item?.name || '-')}
                        </Typography.Text>
                      }
                    </Descriptions.Item>
                    <Descriptions.Item
                      key="3v0s08uuplw"
                      span={1}
                      label={this.i18n('i18n-3szzvcl7') /* 邮箱 */}
                    >
                      {
                        <Typography.Text
                          style={{ fontSize: '' }}
                          strong={false}
                          disabled={false}
                          ellipsis={true}
                          __component_name="Typography.Text"
                        >
                          {__$$eval(() => item?.email || '-')}
                        </Typography.Text>
                      }
                    </Descriptions.Item>
                    <Descriptions.Item
                      key="plk75u4i8vt"
                      span={1}
                      label={this.i18n('i18n-2lcystak') /* 网站 */}
                    >
                      {
                        <Typography.Text
                          style={{ width: '800px', fontSize: '' }}
                          strong={false}
                          disabled={false}
                          ellipsis={true}
                          __component_name="Typography.Text"
                        >
                          {__$$eval(() => item?.url || '-')}
                        </Typography.Text>
                      }
                    </Descriptions.Item>
                  </Descriptions>
                ))(__$$createChildContext(__$$context, { item, index }))
              )}
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
    { path: '/components/:page/:subPage/management-detail/:action/:id' },
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
        <ComponentsDetail$$Page {...dataProps} self={self} appHelper={appHelper} />
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
