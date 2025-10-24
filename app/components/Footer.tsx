"use client";
import { FC } from "react";
import { Flex, Typography, Row, Col } from "antd";

const { Text, Link } = Typography;

interface FooterIO {
  classname?: string;
}

export const Footer: FC<FooterIO> = () => {
  return (
    <Flex
      align="center"
      justify="center"
      style={{
        width: "100%",
        background: "#ffffffff",
        padding: "16px 24px",
        borderTop: "1px solid #f0f0f0",
        boxShadow: "0 -2px 8px rgba(0,0,0,0.03)",
        marginTop: "auto",
      }}
    >
      <Row
        justify="center"
        align="middle"
        style={{ maxWidth: 800, width: "100%", textAlign: "center" }}
      >
        <Col span={24}>
          <Text type="secondary" style={{ fontSize: 13 }}>
            © {new Date().getFullYear()}{" "}
            <Text strong style={{ color: "#1677ff" }}>
              File Exchange Linker
            </Text>{" "}
            — безопасный обмен файлами.
          </Text>
        </Col>

        <Col span={24} style={{ marginTop: 6 }}>
          <Link
            href="https://github.com/"
            target="_blank"
            style={{
              fontSize: 12,
              color: "#8c8c8c",
            }}
          >
            GitHub проекта
          </Link>
        </Col>
      </Row>
    </Flex>
  );
};
