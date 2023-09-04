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
      searchKey: 'name',
      pagination: undefined,
      searchValue: undefined,
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
                          { label: this.i18n('i18n-cuf6u4di') /* 组件名称 */, value: 'name' },
                          { label: this.i18n('i18n-nbsdzxo6') /* 仓库名称 */, value: 'chartName' },
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
                                      src={__$$eval(() => record?.icon || '-')}
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
                                              ellipsis={true}
                                              __component_name="Typography.Text"
                                            >
                                              {__$$eval(() => record?.chartName || '-')}
                                            </Typography.Text>
                                          </Col>
                                          <Col flex="auto" __component_name="Col">
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
                                          </Col>
                                        </Row>
                                      </Col>
                                      <Col span={24} __component_name="Col">
                                        <Typography.Text
                                          style={{ fontSize: '' }}
                                          strong={false}
                                          disabled={false}
                                          ellipsis={{ rows: 2, expandable: false }}
                                          __component_name="Typography.Text"
                                        >
                                          {__$$eval(() => record?.description || '-')}
                                        </Typography.Text>
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
                                              {__$$eval(() => record?.chartName || '-')}
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
                                            style={{ maxWidth: '150px' }}
                                            strong={false}
                                            disabled={false}
                                            ellipsis={true}
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
