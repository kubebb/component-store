// 注意: 出码引擎注入的临时变量默认都以 "__$$" 开头，禁止在搭建的代码中直接访问。
// 例外：react 框架的导出名和各种组件名除外。
import React from 'react';

import {
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  Image,
  Input,
  List,
  Page,
  Radio,
  Row,
  Select,
  Sort,
  Space,
  Tag,
  Tooltip,
  Typography,
} from '@tenx-ui/materials';

import { AntdIconQuestionCircleOutlined } from '@tenx-ui/icon-materials';

import { getUnifiedHistory } from '@tenx-ui/utils/es/UnifiedLink/index.prod';
import { matchPath, useLocation } from '@umijs/max';
import qs from 'query-string';
import DataProvider from '../../components/DataProvider';

import utils, { RefsManager } from '../../utils/__utils';

import * as __$$i18n from '../../i18n';

import __$$constants from '../../__constants';

import './index.css';

class ComponentsMarket$$Page extends React.Component {
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
      type: undefined,
      record: {},
      sorter: undefined,
      current: 1,
      filters: undefined,
      clusters: undefined,
      searchKey: 'chartName',
      pagination: undefined,
      searchValue: undefined,
      clusterLoading: true,
    };
  }

  $ = refName => {
    return this._refsManager.get(refName);
  };

  $$ = refName => {
    return this._refsManager.getAll(refName);
  };

  getType() {
    return this.state.type || this.utils.getComponentTypes(this)?.[0]?.value;
  }

  goDetail(e, { record }) {
    this.history.push(
      `/components/market/subPage/management-detail/detail/${record?.name}?cluster=${this.state.cluster}`
    );
  }

  goInstall(e, { record }) {
    e.stopPropagation();
    this.history.push(
      `/components/market/subPage/management-action/install/${record.name}?cluster=${this.state.cluster}`
    );
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

  handleSortChange(v) {
    this.setState(
      {
        sorter: v,
      },
      this.handleQueryChange
    );
  }

  handleTypeChange(v) {
    this.setState({
      type: v,
    });
  }

  handleQueryChange() {
    const params = {
      page: this.state?.current || 1,
      pageSize: this.state?.pageSize || 10,
      [this.state.searchKey]: this.state?.searchValue,
      cluster: this.state.cluster,
      sortDirection: this.state.sorter || 'descend',
      sortField: 'updatedAt',
    };
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

  paginationShowTotal(total, range) {
    return `${this.i18n('i18n-wajqflwo')} ${total} ${this.i18n('i18n-7vre8aeh')}`;
  }

  getSearchPlaceholder() {
    const i18nKey = {
      name: 'i18n-83r28a2h',
      chartName: 'i18n-q3xp5myo',
      keyword: 'i18n-zvc4wtgs',
    }[this.state.searchKey];
    return i18nKey ? this.i18n(i18nKey) : '';
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
      // current: 1,
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
        <Row wrap={true} __component_name="Row">
          <Col span={24} __component_name="Col">
            <Row wrap={true} gutter={[0, 0]} __component_name="Row">
              <Col span={24} style={{}} __component_name="Col">
                <Row wrap={false} justify="space-between" __component_name="Row">
                  <Col style={{ display: 'flex', alignItems: 'center' }} __component_name="Col">
                    <Typography.Title
                      bold={true}
                      level={1}
                      bordered={false}
                      ellipsis={true}
                      __component_name="Typography.Title"
                    >
                      {this.i18n('i18n-fum9m5ni') /* 组件市场 */}
                    </Typography.Title>
                    <Tooltip
                      title={
                        this.i18n(
                          'i18n-6gp4rswg'
                        ) /* 基于 Kubebb 构建的组件均可通过开放的市场进行共享，并可直接安装或下载部署在自己的服务门户上，让用户选择适合自己的组件进行服务的管理。 */
                      }
                      __component_name="Tooltip"
                    >
                      <AntdIconQuestionCircleOutlined
                        style={{
                          color: 'rgba(0,0,0,0.65)',
                          position: 'relative',
                          marginLeft: '3px',
                        }}
                        __component_name="AntdIconQuestionCircleOutlined"
                      />
                    </Tooltip>
                  </Col>
                  <Col __component_name="Col">
                    <Select
                      style={{ width: 200 }}
                      value={__$$eval(() => this.state.cluster)}
                      options={__$$eval(() => this.state.clusters || [])}
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
            </Row>
          </Col>
          <Col span={24} style={{}} __component_name="Col">
            <Card
              size="default"
              type="default"
              actions={[]}
              loading={false}
              bordered={false}
              hoverable={false}
              __component_name="Card"
            >
              <Row wrap={true} __component_name="Row">
                <Col span={24} __component_name="Col">
                  <Input.Search
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
                        style={{ width: '50' }}
                        value={__$$eval(() => this.state.searchKey)}
                        options={[
                          { label: this.i18n('i18n-cuf6u4di') /* 组件名称 */, value: 'chartName' },
                          { label: this.i18n('i18n-nbsdzxo6') /* 仓库名称 */, value: 'repository' },
                          { label: this.i18n('i18n-yw1xiu88') /* 关键词 */, value: 'keyword' },
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
                        placeholder={this.i18n('i18n-fald39iq') /* 请选择 */}
                        _sdkSwrGetFunc={{ params: [] }}
                        __component_name="Select"
                      />
                    }
                    placeholder={__$$eval(() => this.getSearchPlaceholder())}
                    __component_name="Input.Search"
                  />
                </Col>
                <Col span={24} __component_name="Col">
                  <Row wrap={false} justify="space-between" __component_name="Row">
                    <Col __component_name="Col">
                      <Space align="center" direction="horizontal" __component_name="Space">
                        <Typography.Text
                          style={{ fontSize: '' }}
                          strong={false}
                          disabled={false}
                          ellipsis={true}
                          __component_name="Typography.Text"
                        >
                          {this.i18n('i18n-76p3ahxg') /* 组件分类 */}
                        </Typography.Text>
                        <Radio.Group
                          size="middle"
                          value={__$$eval(() => this.getType())}
                          options={__$$eval(() =>
                            this.utils.getComponentTypes(this)?.map(item => ({
                              ...item,
                              label: item.text,
                            }))
                          )}
                          disabled={false}
                          onChange={function () {
                            return this.handleTypeChange.apply(
                              this,
                              Array.prototype.slice.call(arguments).concat([])
                            );
                          }.bind(this)}
                          optionType="button"
                          buttonSpace={true}
                          buttonStyle="tag"
                          _sdkSwrGetFunc={{}}
                          __component_name="Radio.Group"
                        />
                      </Space>
                    </Col>
                    <Col __component_name="Col">
                      <Space align="center" direction="horizontal" __component_name="Space">
                        <Sort
                          title={this.i18n('i18n-m6kwhtjg') /* 更新时间 */}
                          onChange={function () {
                            return this.handleSortChange.apply(
                              this,
                              Array.prototype.slice.call(arguments).concat([])
                            );
                          }.bind(this)}
                          __component_name="Sort"
                        />
                        <Row wrap={true} gutter={[0, 0]} __component_name="Row">
                          <Col
                            span={24}
                            style={{ height: '12px', display: 'flex' }}
                            __component_name="Col"
                          />
                          <Col
                            span=""
                            style={{ height: '12px', display: 'flex' }}
                            __component_name="Col"
                          />
                        </Row>
                      </Space>
                    </Col>
                  </Row>
                </Col>
                <Col span={24} __component_name="Col">
                  <List
                    ref={this._refsManager.linkRef('list-09418a79')}
                    grid={{ lg: 4, md: 4, sm: 4, xl: 4, xs: 4, xxl: 4, column: 4, gutter: 20 }}
                    size="small"
                    split={false}
                    rowKey="id"
                    loading={__$$eval(
                      () =>
                        this.props.useGetComponents?.isLoading ||
                        this.props?.useGetComponents?.loading ||
                        this.state.clusterLoading ||
                        false
                    )}
                    bordered={false}
                    dataSource={__$$eval(
                      () => this.props.useGetComponents?.data?.components?.nodes || []
                    )}
                    itemLayout="horizontal"
                    pagination={{
                      size: 'default',
                      total: __$$eval(
                        () => this.props.useGetComponents?.data?.components?.totalCount || 0
                      ),
                      simple: true,
                      current: __$$eval(() => this.state.current),
                      onChange: function () {
                        return this.handlePaginationChange.apply(
                          this,
                          Array.prototype.slice.call(arguments).concat([])
                        );
                      }.bind(this),
                      pageSize: __$$eval(() => this.state.size),
                      position: 'bottom',
                      showTotal: function () {
                        return this.paginationShowTotal.apply(
                          this,
                          Array.prototype.slice.call(arguments).concat([])
                        );
                      }.bind(this),
                      showQuickJumper: false,
                      showSizeChanger: false,
                    }}
                    renderItem={record =>
                      (__$$context => (
                        <List.Item ref={this._refsManager.linkRef('list.item-e9063858')}>
                          <Card
                            ref={this._refsManager.linkRef('card-6992996d')}
                            size="default"
                            type="inner"
                            cover=""
                            style={{
                              cursor: 'pointer',
                              overflow: 'hidden',
                              background: '#FAFAFA',
                              paddingTop: '8px',
                              paddingBottom: '4px',
                            }}
                            actions={[]}
                            loading={false}
                            onClick={function () {
                              return this.goDetail.apply(
                                this,
                                Array.prototype.slice.call(arguments).concat([
                                  {
                                    record: record,
                                  },
                                ])
                              );
                            }.bind(__$$context)}
                            bordered={false}
                            hoverable={false}
                          >
                            {!!__$$eval(
                              () =>
                                (new Date().getTime() - new Date(record?.updatedAt).getTime()) /
                                  1000 /
                                  60 /
                                  60 /
                                  24 <
                                7
                            ) && (
                              <Tag
                                color="#5BC427"
                                style={{
                                  top: '-33px',
                                  right: '-41px',
                                  width: '65px',
                                  height: '65px',
                                  display: 'flex',
                                  position: 'absolute',
                                  transform: 'rotate(45deg)',
                                  alignItems: 'flex-end',
                                  borderRadius: '0px',
                                  paddingBottom: '4px',
                                  justifyContent: 'center',
                                }}
                                closable={false}
                                __component_name="Tag"
                              >
                                NEW
                              </Tag>
                            )}
                            <Row wrap={true} gutter={[0, 0]} __component_name="Row">
                              <Col span={24} __component_name="Col">
                                <Row wrap={false} __component_name="Row">
                                  <Col
                                    flex="96px"
                                    span=""
                                    style={{
                                      height: '64px',
                                      display: 'flex',
                                      alignItems: 'center',
                                    }}
                                    __component_name="Col"
                                  >
                                    <Image
                                      src={__$$eval(
                                        () =>
                                          record?.icon ||
                                          'data:image/png;base64,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'
                                      )}
                                      width={64}
                                      height="auto"
                                      preview={false}
                                      fallback=""
                                      __component_name="Image"
                                    />
                                  </Col>
                                  <Col flex="auto" __component_name="Col">
                                    <Row wrap={true} gutter={[0, 0]} __component_name="Row">
                                      <Col span={24} __component_name="Col">
                                        <Row wrap={false} __component_name="Row">
                                          <Col
                                            flex=""
                                            style={{ maxWidth: 'calc(100% - 60px)' }}
                                            __component_name="Col"
                                          >
                                            <Typography.Text
                                              style={{ fontSize: '18px' }}
                                              strong={true}
                                              disabled={false}
                                              ellipsis={{
                                                tooltip: {
                                                  title: __$$eval(() => record?.chartName),
                                                  _unsafe_MixedSetter_title_select:
                                                    'VariableSetter',
                                                },
                                              }}
                                              __component_name="Typography.Text"
                                            >
                                              {__$$eval(() => record?.chartName || '-')}
                                            </Typography.Text>
                                          </Col>
                                          <Col flex="auto" __component_name="Col">
                                            {!!__$$eval(
                                              () =>
                                                __$$context.utils
                                                  .getComponentTypes(__$$context, false, true)
                                                  ?.find(item => item.value === record?.source)
                                                  ?.children
                                            ) && (
                                              <Tag
                                                color={__$$eval(
                                                  () =>
                                                    __$$context.utils
                                                      .getComponentTypes(__$$context, false, true)
                                                      ?.find(item => item.value === record?.source)
                                                      ?.color || 'processing'
                                                )}
                                                closable={false}
                                                __component_name="Tag"
                                              >
                                                {__$$eval(
                                                  () =>
                                                    __$$context.utils
                                                      .getComponentTypes(__$$context, false, true)
                                                      ?.find(item => item.value === record?.source)
                                                      ?.children || '-'
                                                )}
                                              </Tag>
                                            )}
                                          </Col>
                                        </Row>
                                      </Col>
                                      <Col
                                        span={24}
                                        style={{ marginTop: '8px' }}
                                        __component_name="Col"
                                      >
                                        <Typography.Paragraph
                                          code={false}
                                          mark={false}
                                          style={{ fontSize: '' }}
                                          delete={false}
                                          strong={false}
                                          disabled={false}
                                          editable={false}
                                          ellipsis={{
                                            rows: 2,
                                            tooltip: {
                                              title: __$$eval(() => record?.description),
                                              _unsafe_MixedSetter_title_select: 'VariableSetter',
                                            },
                                          }}
                                          underline={false}
                                        >
                                          {__$$eval(() => record?.description || '-')}
                                        </Typography.Paragraph>
                                      </Col>
                                    </Row>
                                  </Col>
                                </Row>
                              </Col>
                              <Col
                                span={24}
                                style={{ marginBottom: '-11px' }}
                                __component_name="Col"
                              >
                                <Divider
                                  mode="line"
                                  style={{ width: 'calc(100% + 48px)', marginLeft: '-24px' }}
                                  dashed={false}
                                  content={[null]}
                                  children=""
                                  defaultOpen={true}
                                  orientation="left"
                                  __component_name="Divider"
                                  orientationMargin={0}
                                />
                              </Col>
                              <Col span={24} __component_name="Col">
                                <Row wrap={true} gutter={[0, 20]} __component_name="Row">
                                  <Col span={24} __component_name="Col">
                                    <Descriptions
                                      id=""
                                      size="small"
                                      colon={false}
                                      items={[
                                        {
                                          key: 'sjhjyjnjz7',
                                          span: 1,
                                          label: this.i18n('i18n-vpbgp1lj') /* 最新版本 */,
                                          children: (
                                            <Typography.Text
                                              style={{ fontSize: '' }}
                                              strong={false}
                                              disabled={false}
                                              ellipsis={{ rows: 1, expandable: false }}
                                              __component_name="Typography.Text"
                                            >
                                              {__$$eval(
                                                () =>
                                                  record?.versions?.sort(
                                                    (a, b) =>
                                                      new Date(a.createdAt).getTime() -
                                                      new Date(b.createdAt).getTime()
                                                  )?.[0]?.version || '-'
                                              )}
                                            </Typography.Text>
                                          ),
                                        },
                                        {
                                          key: 'xr185l2hzle',
                                          span: 1,
                                          label: this.i18n('i18n-1po87kgw') /* 组件仓库 */,
                                          children: (
                                            <Typography.Text
                                              style={{ fontSize: '' }}
                                              strong={false}
                                              disabled={false}
                                              ellipsis={true}
                                              __component_name="Typography.Text"
                                            >
                                              {__$$eval(() => record?.repository || '-')}
                                            </Typography.Text>
                                          ),
                                        },
                                        {
                                          key: 'y40p6qx5p9c',
                                          span: 1,
                                          label: this.i18n('i18n-yw1xiu88') /* 关键词 */,
                                          children: (
                                            <Typography.Text
                                              style={{ maxWidth: '150px' }}
                                              strong={false}
                                              disabled={false}
                                              ellipsis={true}
                                              __component_name="Typography.Text"
                                            >
                                              {__$$eval(() => record?.keywords?.join('，') || '-')}
                                            </Typography.Text>
                                          ),
                                        },
                                      ]}
                                      title=""
                                      column={1}
                                      layout="horizontal"
                                      bordered={false}
                                      labelStyle={{ width: 90 }}
                                      borderedBottom={true}
                                      __component_name="Descriptions"
                                      borderedBottomDashed={false}
                                    >
                                      <Descriptions.Item
                                        key="sjhjyjnjz7"
                                        span={1}
                                        label={this.i18n('i18n-vpbgp1lj') /* 最新版本 */}
                                      >
                                        {
                                          <Typography.Text
                                            style={{ fontSize: '' }}
                                            strong={false}
                                            disabled={false}
                                            ellipsis={{ rows: 1, expandable: false }}
                                            __component_name="Typography.Text"
                                          >
                                            {__$$eval(
                                              () =>
                                                record?.versions?.sort(
                                                  (a, b) =>
                                                    new Date(a.createdAt).getTime() -
                                                    new Date(b.createdAt).getTime()
                                                )?.[0]?.version || '-'
                                            )}
                                          </Typography.Text>
                                        }
                                      </Descriptions.Item>
                                      <Descriptions.Item
                                        key="xr185l2hzle"
                                        span={1}
                                        label={this.i18n('i18n-1po87kgw') /* 组件仓库 */}
                                      >
                                        {
                                          <Typography.Text
                                            style={{ fontSize: '' }}
                                            strong={false}
                                            disabled={false}
                                            ellipsis={true}
                                            __component_name="Typography.Text"
                                          >
                                            {__$$eval(() => record?.repository || '-')}
                                          </Typography.Text>
                                        }
                                      </Descriptions.Item>
                                      <Descriptions.Item
                                        key="y40p6qx5p9c"
                                        span={1}
                                        label={this.i18n('i18n-yw1xiu88') /* 关键词 */}
                                      >
                                        {
                                          <Typography.Text
                                            style={{ fontSize: '', maxWidth: '150px' }}
                                            strong={false}
                                            disabled={false}
                                            ellipsis={{
                                              tooltip: __$$eval(() => record?.keywords?.join('，')),
                                              _unsafe_MixedSetter_tooltip_select:
                                                'ExpressionSetter',
                                            }}
                                            __component_name="Typography.Text"
                                          >
                                            {__$$eval(() => record?.keywords?.join('，') || '-')}
                                          </Typography.Text>
                                        }
                                      </Descriptions.Item>
                                    </Descriptions>
                                  </Col>
                                  <Col span={24} __component_name="Col">
                                    <Button
                                      href=""
                                      icon=""
                                      size="small"
                                      type="primary"
                                      block={false}
                                      ghost={true}
                                      shape="default"
                                      style={{ width: '100%', display: 'inline' }}
                                      danger={false}
                                      onClick={function () {
                                        return this.goInstall.apply(
                                          this,
                                          Array.prototype.slice.call(arguments).concat([
                                            {
                                              record: record,
                                            },
                                          ])
                                        );
                                      }.bind(__$$context)}
                                      disabled={false}
                                      hoverColor="primary"
                                      __component_name="Button"
                                    >
                                      {this.i18n('i18n-s827y1s8') /* 安装 */}
                                    </Button>
                                  </Col>
                                </Row>
                              </Col>
                            </Row>
                          </Card>
                        </List.Item>
                      ))(__$$createChildContext(__$$context, { record }))
                    }
                    __component_name="List"
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
  const match = matchPath({ path: '/components/market' }, location.pathname);
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
      ]}
      render={dataProps => (
        <ComponentsMarket$$Page {...dataProps} self={self} appHelper={appHelper} />
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
