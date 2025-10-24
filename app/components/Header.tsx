"use client";
import { FC } from "react";
import { Flex, Row, Col, Typography, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

interface HeaderIO {
  classname?: string;
}

export const Header: FC<HeaderIO> = () => {
  return (
    <Flex
      align="center"
      justify="space-between"
      style={{
        width: "100%",
        background: "#ffffff",
        padding: "16px 32px",
        borderBottom: "1px solid #f0f0f0",
        position: "sticky",
        top: 0,
        zIndex: 100,
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      }}
    >
      <Row align="middle" gutter={16}>
        <Col>
          <Title
            level={3}
            style={{
              margin: 0,
              color: "#1677ff",
              letterSpacing: "0.5px",
            }}
          >
            File Exchange Linker
          </Title>
          <Text type="secondary" style={{ fontSize: 12 }}>
            безопасный обмен файлами
          </Text>
        </Col>
      </Row>

      
    </Flex>
  );
};
