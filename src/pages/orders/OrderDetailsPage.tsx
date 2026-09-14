import { useState, type ReactNode } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Button,
  Card,
  Spin,
  Avatar,
  Tag,
  Image,
  Tabs,
  Collapse,
  Progress,
  Empty,
  message,
} from 'antd';
import {
  ArrowLeftOutlined,
  UserOutlined,
  CopyOutlined,
  LinkOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
import StatusBadge from '@/components/common/StatusBadge';
import { useGetOrderDetailsQuery } from '@/services/order.api';
import type { OrderGuidelineSteps, OrderPlatformGuideline, OrderUser } from '@/types';
import dayjs from 'dayjs';

function isOrderUser(user: string | OrderUser): user is OrderUser {
  return typeof user === 'object' && user !== null && '_id' in user;
}

function formatMb(value: number) {
  if (value >= 1024) return `${(value / 1024).toFixed(2)} GB`;
  return `${value} MB`;
}

function StepsList({ steps }: { steps: OrderGuidelineSteps }) {
  return (
    <ol style={{ margin: 0, paddingLeft: 20, color: '#4b5563', lineHeight: 1.8, fontSize: 13 }}>
      {Object.keys(steps)
        .sort((a, b) => Number(a) - Number(b))
        .map((key) => (
          <li key={key} style={{ marginBottom: 6 }}>
            {steps[key]}
          </li>
        ))}
    </ol>
  );
}

function copyText(text: string, label: string) {
  navigator.clipboard.writeText(text);
  message.success(`${label} copied`);
}

function GuidelinePanel({ guides, platform }: { guides: OrderPlatformGuideline[]; platform: string }) {
  if (!guides?.length) return <Empty description={`No ${platform} guides`} />;

  return (
    <Collapse
      accordion
      items={guides.map((guide, index) => ({
        key: String(index),
        label: (
          <span style={{ fontWeight: 600 }}>
            {platform.toUpperCase()} Guide {index + 1}
            {guide.version ? ` (iOS ${guide.version})` : ''}
          </span>
        ),
        children: (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <div style={{ fontWeight: 700, marginBottom: 8, fontSize: 13 }}>Install via QR Code</div>
              <StepsList steps={guide.installation_via_qr_code.steps} />
              {guide.installation_via_qr_code.qr_code_url && (
                <Image
                  src={guide.installation_via_qr_code.qr_code_url}
                  width={140}
                  style={{ marginTop: 12, borderRadius: 8, border: '1px solid #f0f0f0' }}
                />
              )}
            </div>
            <div>
              <div style={{ fontWeight: 700, marginBottom: 8, fontSize: 13 }}>Manual Installation</div>
              <StepsList steps={guide.installation_manual.steps} />
              {guide.installation_manual.smdp_address && (
                <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  <Tag
                    style={{ cursor: 'pointer' }}
                    onClick={() => copyText(guide.installation_manual.smdp_address!, 'SM-DP+ Address')}
                  >
                    SM-DP+: {guide.installation_manual.smdp_address} <CopyOutlined />
                  </Tag>
                  {guide.installation_manual.activation_code && (
                    <Tag
                      style={{ cursor: 'pointer' }}
                      onClick={() =>
                        copyText(guide.installation_manual.activation_code!, 'Activation code')
                      }
                    >
                      Code: {guide.installation_manual.activation_code} <CopyOutlined />
                    </Tag>
                  )}
                </div>
              )}
            </div>
            <div>
              <div style={{ fontWeight: 700, marginBottom: 8, fontSize: 13 }}>Network Setup</div>
              <StepsList steps={guide.network_setup.steps} />
              <div style={{ marginTop: 8, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <Tag>APN: {guide.network_setup.apn_type}</Tag>
                {guide.network_setup.apn_value && <Tag>{guide.network_setup.apn_value}</Tag>}
                <Tag color={guide.network_setup.is_roaming ? 'green' : 'default'}>
                  Roaming {guide.network_setup.is_roaming ? 'On' : 'Off'}
                </Tag>
              </div>
            </div>
          </div>
        ),
      }))}
    />
  );
}

function InfoRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: 16,
        padding: '10px 0',
        borderBottom: '1px solid #f5f5f5',
        fontSize: 13,
      }}
    >
      <span style={{ color: '#6b7280' }}>{label}</span>
      <span style={{ fontWeight: 600, color: '#1a1a2e', textAlign: 'right' }}>{value}</span>
    </div>
  );
}

export default function OrderDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [guideTab, setGuideTab] = useState('ios');

  const { data, isLoading, isError } = useGetOrderDetailsQuery(id!, { skip: !id });

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: 80 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (isError || !data?.data?.order) {
    return (
      <div style={{ textAlign: 'center', padding: 80 }}>
        <Empty description="Order not found" />
        <Button style={{ marginTop: 16 }} onClick={() => navigate('/orders')}>
          Back to Orders
        </Button>
      </div>
    );
  }

  const { order, realTimeUses, guidelines } = data.data;
  const user = isOrderUser(order.user) ? order.user : null;
  const usagePercent =
    realTimeUses && !realTimeUses.is_unlimited && realTimeUses.total > 0
      ? Math.round(((realTimeUses.total - realTimeUses.remaining) / realTimeUses.total) * 100)
      : 0;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/orders')} style={{ borderRadius: 8 }}>
          Back
        </Button>
        <div>
          <div className="page-title" style={{ marginBottom: 0 }}>
            Order Details
          </div>
          <div style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>
            <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#1a1a2e' }}>
              {order.orderId || order.code}
            </span>
            <span style={{ margin: '0 8px' }}>·</span>
            <StatusBadge status={order.status} />
          </div>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 2fr) minmax(280px, 1fr)',
          gap: 20,
          marginTop: 24,
          alignItems: 'start',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Card style={{ borderRadius: 16, border: '1px solid #f0f0f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
              {order.oparator_info?.image && (
                <Image
                  src={order.oparator_info.image}
                  width={48}
                  height={48}
                  preview={false}
                  style={{ objectFit: 'contain', borderRadius: 10 }}
                />
              )}
              <div>
                <div style={{ fontWeight: 700, fontSize: 18, color: '#1a1a2e' }}>{order.package_name}</div>
                <div style={{ fontSize: 13, color: '#6b7280', marginTop: 2 }}>
                  {order.oparator_info?.name || order.country} · {order.data} · {order.validity} days
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px' }}>
              <InfoRow label="Order ID" value={order.orderId || order._id} />
              <InfoRow label="Package ID" value={order.packageId} />
              <InfoRow label="Type" value={order.type} />
              <InfoRow label="Quantity" value={order.quantity} />
              <InfoRow label="Price" value={`$${order.price}`} />
              <InfoRow label="Net Price" value={`$${order.net_price}`} />
              <InfoRow label="Commission" value={`$${order.system_commission ?? 0}`} />
              <InfoRow label="Country" value={order.country} />
              <InfoRow
                label="Start Date"
                value={dayjs(order.startDate).format('MMM D, YYYY h:mm A')}
              />
              <InfoRow
                label="End Date"
                value={order.endDate ? dayjs(order.endDate).format('MMM D, YYYY h:mm A') : '—'}
              />
              <InfoRow
                label="Created"
                value={dayjs(order.createdAt).format('MMM D, YYYY h:mm A')}
              />
              {order.installation_guides && (
                <InfoRow
                  label="Guides"
                  value={
                    <a href={order.installation_guides} target="_blank" rel="noreferrer">
                      Open <LinkOutlined />
                    </a>
                  }
                />
              )}
            </div>
          </Card>

          {realTimeUses && (
            <Card title={<span style={{ fontWeight: 700 }}>Real-time Usage</span>} style={{ borderRadius: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
                <Progress
                  type="circle"
                  percent={realTimeUses.is_unlimited ? 0 : usagePercent}
                  format={() =>
                    realTimeUses.is_unlimited
                      ? '∞'
                      : `${formatMb(realTimeUses.remaining)}`
                  }
                  strokeColor="#009A54"
                />
                <div style={{ flex: 1, minWidth: 200 }}>
                  <InfoRow label="Status" value={<StatusBadge status={realTimeUses.status} />} />
                  <InfoRow
                    label="Data"
                    value={
                      realTimeUses.is_unlimited
                        ? 'Unlimited'
                        : `${formatMb(realTimeUses.remaining)} / ${formatMb(realTimeUses.total)}`
                    }
                  />
                  <InfoRow
                    label="Voice"
                    value={`${realTimeUses.remaining_voice} / ${realTimeUses.total_voice}`}
                  />
                  <InfoRow
                    label="Text"
                    value={`${realTimeUses.remaining_text} / ${realTimeUses.total_text}`}
                  />
                  <InfoRow
                    label="Expires"
                    value={dayjs(realTimeUses.expired_at).format('MMM D, YYYY h:mm A')}
                  />
                </div>
              </div>
            </Card>
          )}

          <Card title={<span style={{ fontWeight: 700 }}>SIMs ({order.sims?.length || 0})</span>} style={{ borderRadius: 16 }}>
            {!order.sims?.length ? (
              <Empty description="No SIMs found" />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {order.sims.map((sim) => (
                  <div
                    key={sim.id}
                    style={{
                      border: '1px solid #f0f0f0',
                      borderRadius: 12,
                      padding: 16,
                      display: 'grid',
                      gridTemplateColumns: '140px 1fr',
                      gap: 16,
                    }}
                  >
                    <div style={{ textAlign: 'center' }}>
                      <Image
                        src={sim.qrcode_url}
                        width={120}
                        style={{ borderRadius: 8, border: '1px solid #f0f0f0' }}
                      />
                      <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 6 }}>SIM #{sim.id}</div>
                    </div>
                    <div>
                      <InfoRow
                        label="ICCID"
                        value={
                          <span
                            style={{ cursor: 'pointer' }}
                            onClick={() => copyText(sim.iccid, 'ICCID')}
                          >
                            {sim.iccid} <CopyOutlined />
                          </span>
                        }
                      />
                      <InfoRow label="LPA" value={sim.lpa} />
                      <InfoRow
                        label="Matching ID"
                        value={
                          <span
                            style={{ cursor: 'pointer', wordBreak: 'break-all' }}
                            onClick={() => copyText(sim.matching_id, 'Matching ID')}
                          >
                            {sim.matching_id} <CopyOutlined />
                          </span>
                        }
                      />
                      <InfoRow label="APN" value={`${sim.apn_type}${sim.apn_value ? ` · ${sim.apn_value}` : ''}`} />
                      <InfoRow
                        label="Roaming"
                        value={sim.is_roaming ? <Tag color="green">Enabled</Tag> : <Tag>Disabled</Tag>}
                      />
                      {sim.direct_apple_installation_url && (
                        <InfoRow
                          label="Apple Install"
                          value={
                            <a href={sim.direct_apple_installation_url} target="_blank" rel="noreferrer">
                              Open link <LinkOutlined />
                            </a>
                          }
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {guidelines && (
            <Card title={<span style={{ fontWeight: 700 }}>Installation Guidelines</span>} style={{ borderRadius: 16 }}>
              <Tabs
                activeKey={guideTab}
                onChange={setGuideTab}
                items={[
                  {
                    key: 'ios',
                    label: 'iOS',
                    children: <GuidelinePanel guides={guidelines.ios || []} platform="iOS" />,
                  },
                  {
                    key: 'android',
                    label: 'Android',
                    children: <GuidelinePanel guides={guidelines.android || []} platform="Android" />,
                  },
                ]}
              />
            </Card>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Card title={<span style={{ fontWeight: 700 }}>Customer</span>} style={{ borderRadius: 16 }}>
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Avatar src={user.image} icon={<UserOutlined />} size={48} style={{ background: '#009A54' }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{user.name}</div>
                  <div style={{ fontSize: 13, color: '#6b7280' }}>{user.email}</div>
                  {user.contact && <div style={{ fontSize: 12, color: '#9ca3af' }}>{user.contact}</div>}
                </div>
              </div>
            ) : (
              <div style={{ fontSize: 13, color: '#6b7280' }}>
                User ID: <span style={{ fontFamily: 'monospace' }}>{String(order.user)}</span>
              </div>
            )}
          </Card>

          <Card
            title={
              <span style={{ fontWeight: 700 }}>
                <GlobalOutlined style={{ marginRight: 8 }} />
                Supported Countries
              </span>
            }
            style={{ borderRadius: 16 }}
          >
            {!order.supported_countries?.length ? (
              <Empty description="No countries" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {order.supported_countries.map((country) => (
                  <div
                    key={country.country_code}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '8px 10px',
                      background: '#fafafa',
                      borderRadius: 10,
                    }}
                  >
                    {country.image?.url && (
                      <Image
                        src={country.image.url}
                        width={32}
                        height={24}
                        preview={false}
                        style={{ objectFit: 'cover', borderRadius: 4 }}
                      />
                    )}
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{country.title}</div>
                      <div style={{ fontSize: 11, color: '#9ca3af' }}>{country.country_code}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {(order.qr_installation || order.manual_installation) && (
            <Card title={<span style={{ fontWeight: 700 }}>Quick Install Notes</span>} style={{ borderRadius: 16 }}>
              <Collapse
                items={[
                  order.qr_installation
                    ? {
                        key: 'qr',
                        label: 'QR Installation',
                        children: (
                          <div
                            style={{ fontSize: 13, color: '#4b5563', lineHeight: 1.7 }}
                            dangerouslySetInnerHTML={{ __html: order.qr_installation }}
                          />
                        ),
                      }
                    : null,
                  order.manual_installation
                    ? {
                        key: 'manual',
                        label: 'Manual Installation',
                        children: (
                          <div
                            style={{ fontSize: 13, color: '#4b5563', lineHeight: 1.7 }}
                            dangerouslySetInnerHTML={{ __html: order.manual_installation }}
                          />
                        ),
                      }
                    : null,
                ].filter(Boolean) as { key: string; label: string; children: ReactNode }[]}
              />
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
