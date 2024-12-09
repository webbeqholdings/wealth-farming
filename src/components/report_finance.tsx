import { PageTop, PageBottom, PageBreak } from "@fileforge/react-print";
import { formatDateTime } from "@/utilities/formatDateTime";

export const Document = () => {
  return (
    <div
      style={{
        fontFamily: '"Roboto", sans-serif',
        lineHeight: '1.6',
        color: '#333',
        margin: '0 auto',
        padding: '20px',
        maxWidth: '800px',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      }}
    >
      {/* Page Header */}
      <PageTop style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1
          style={{
            fontSize: '24px',
            color: '#0044cc',
            marginBottom: '10px',
            fontWeight: 'bold',
          }}
        >
          Finance Report - December 2024
        </h1>
        <hr
          style={{
            width: '60%',
            margin: '0 auto',
            borderTop: '2px solid #0044cc',
          }}
        />
      </PageTop>

      {/* Product & Fund Information */}
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '18px', color: '#333', marginBottom: '10px' }}>
          Product: <span style={{ fontWeight: 'normal' }}>Sustainable Energy Fund E</span>
        </h2>
        <p
          style={{
            fontSize: '14px',
            color: '#555',
            lineHeight: '1.6',
          }}
        >
          Description: An environmentally-conscious product focused on renewable energy projects with competitive returns.
        </p>

        <h3
          style={{
            fontSize: '16px',
            color: '#0044cc',
            marginTop: '20px',
            fontWeight: 'bold',
          }}
        >
          Investment Details:
        </h3>
        <ul
          style={{
            paddingLeft: '20px',
            fontSize: '14px',
            color: '#555',
            listStyleType: 'circle',
            lineHeight: '1.8',
          }}
        >
          <li>Minimum Investment: $5000</li>
          <li>Maximum Investment: $100000</li>
          <li>Interest Rate: 6.5% - 8.5% (Quarterly)</li>
          <li>Status: Available</li>
          <li>Start Date: {formatDateTime("2023-06-30T17:00:00.000Z")}</li>
          <li>End Date: {formatDateTime("2030-06-30T17:00:00.000Z")}</li>
        </ul>

        <h3
          style={{
            fontSize: '16px',
            color: '#0044cc',
            marginTop: '20px',
            fontWeight: 'bold',
          }}
        >
          Fund Manager Information:
        </h3>
        <ul
          style={{
            paddingLeft: '20px',
            fontSize: '14px',
            color: '#555',
            listStyleType: 'circle',
            lineHeight: '1.8',
          }}
        >
          <li>Name: Huynh Dang Nghia</li>
          <li>Email: admin@gmail.com</li>
          <li>Phone: 0905832110</li>
          <li>Role: Admin</li>
        </ul>

        <h3
          style={{
            fontSize: '16px',
            color: '#0044cc',
            marginTop: '20px',
            fontWeight: 'bold',
          }}
        >
          Fund Overview:
        </h3>
        <p style={{ fontSize: '14px', color: '#555' }}>
          Investing in renewable energy and green technology.
        </p>
        <p style={{ fontSize: '14px', color: '#555' }}>
          Category: Sustainable Investments
        </p>
      </div>

      {/* Page Footer */}
      <PageBottom
        style={{
          textAlign: 'center',
          marginTop: '50px',
          fontSize: '10px',
          color: '#888',
          borderTop: '1px solid #ddd',
          paddingTop: '10px',
        }}
      >
        Finance Report Generated: {formatDateTime("2024-12-01T00:00:00.000Z")}
      </PageBottom>

      {/* Page Break for Next Section */}
      <PageBreak />

      {/* Additional Content for the Next Page */}
      <div style={{ marginTop: '40px' }}>
        <h2 style={{ fontSize: '18px', color: '#333', marginBottom: '20px' }}>Important Notes</h2>
        <p
          style={{
            fontSize: '14px',
            color: '#555',
            lineHeight: '1.8',
          }}
        >
          The Sustainable Energy Fund offers high returns with a focus on eco-friendly, renewable energy investments. As an investor, you’ll have the opportunity to contribute to global sustainability efforts while earning competitive returns.
        </p>
      </div>
    </div>
  );
};
