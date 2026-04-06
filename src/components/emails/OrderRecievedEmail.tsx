import { ShippingAddress } from "@prisma/client";
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface OrderReceivedEmailProps {
  shippingAddress: ShippingAddress;
  orderId: string;
  orderDate: string;
  totalAmount: number;
}

const OrderReceivedEmail = ({
  shippingAddress,
  orderId,
  orderDate,
  totalAmount,
}: OrderReceivedEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>您的 Vegan Festbox 訂單已確認！🌱</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={messageSection}>
            <Heading style={h1}>Welcome to Vegan Festbox!🌱</Heading>
            <Text style={text}>Hi {shippingAddress.name},</Text>
            <Text style={text}>
              感謝加入純植生活！我們很高興能為您準備這份專屬的永續禮盒。<br />
              訂單正在安排中，您的支持，讓我們能持續推廣對地球更溫柔的選擇。🌍💕
            </Text>
          </Section>

          <Hr style={hr} />

          <Section style={detailsSection}>
            <Text style={sectionTitle}>配送資訊 🚚</Text>
            <div style={infoBox}>
              <Text style={addressText}>
                {shippingAddress.postalCode} {shippingAddress.city}{shippingAddress.district}
              </Text>
              <Text style={addressText}>
                {shippingAddress.address}
              </Text>
              <Text style={addressText}>
                聯絡電話：{shippingAddress.phoneNumber}
              </Text>
            </div>
          </Section>

          <Section style={detailsSection}>
            <Text style={sectionTitle}>訂單明細 📋</Text>
            <Text style={orderInfo}><strong>訂單編號：</strong> <span style={code}>#{orderId.slice(0, 8).toUpperCase()}</span></Text>
            <Text style={orderInfo}><strong>訂單日期：</strong> {orderDate}</Text>
            <Text style={{ ...orderInfo, fontSize: "16px", marginTop: "12px", color: "#3e5c35" }}>
              <strong>總金額：</strong> NT$ {totalAmount.toLocaleString()}
            </Text>
          </Section>

          <Hr style={hr} />

          <Section style={footerSection}>
            <Text style={footerText}>
              我們將在出貨時透過 Email 再次通知您。
            </Text>
            <Text style={{ ...footerText, marginTop: "12px", color: "#718096" }}>
              與您一同分享純植美好，✨<br />
              <strong>Vegan Festbox 團隊敬上</strong>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default OrderReceivedEmail;

const main = {
  backgroundColor: "#f4f7f4",
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  border: "1px solid #e2e8f0",
  borderRadius: "12px",
  margin: "40px auto",
  padding: "40px",
  width: "580px",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
};

const h1 = {
  color: "#3e5c35",
  fontSize: "26px",
  fontWeight: "bold",
  textAlign: "center" as const,
  margin: "30px 0",
};

const text = {
  color: "#4a5568",
  fontSize: "16px",
  lineHeight: "26px",
};

const messageSection = {
  padding: "0 10px",
};

const detailsSection = {
  padding: "20px 10px",
};

const sectionTitle = {
  fontSize: "15px",
  fontWeight: "bold",
  color: "#2d3748",
  marginBottom: "12px",
  letterSpacing: "0.5px",
};

const infoBox = {
  backgroundColor: "#f8fafc",
  padding: "16px",
  borderRadius: "8px",
  border: "1px solid #edf2f7",
};

const addressText = {
  ...text,
  fontSize: "14px",
  color: "#64748b",
  margin: "4px 0",
};

const orderInfo = {
  ...text,
  fontSize: "14px",
  margin: "6px 0",
};

const code = {
  fontFamily: "monospace",
  backgroundColor: "#f1f5f9",
  padding: "2px 6px",
  borderRadius: "4px",
  color: "#475569",
};

const hr = {
  borderColor: "#e2e8f0",
  margin: "24px 0",
};

const footerSection = {
  textAlign: "center" as const,
  padding: "20px 0",
};

const footerText = {
  color: "#94a3b8",
  fontSize: "13px",
  lineHeight: "20px",
};