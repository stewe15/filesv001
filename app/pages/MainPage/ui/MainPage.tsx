"use client";

import { FC } from "react";
import { Flex, Row, Col, Typography, Divider } from "antd";
import Title from "antd/es/typography/Title";
import { DragNDrop } from "@/app/components/UploadCustom";

const { Text } = Typography;

interface MainPageIO {
  classname?: string;
}

export const MainPage: FC<MainPageIO> = () => {
  return (
    <Flex
      vertical
      align="center"
      justify="center"
      style={{
        minHeight: "10vh",
        background: "#7cb1e7ff",
        padding: "40px 20px",
      }}
    >
      <Row
        justify="center"
        style={{
          width: "100%",
          maxWidth: 800,
          background: "#137ee8ff",
          borderRadius: 16,
          padding: "40px 32px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        }}
      >
        <Col span={24}>
          <Flex vertical align="center" gap={12}>
            <Title level={3} style={{ marginBottom: 8, color:'white' }}>
              Загрузить и поделиться файлом
            </Title>
            <Text type="secondary" style={{ textAlign: "center", maxWidth: 500, color:'white'  }}>
              Перетащите или выберите файл для загрузки. Вы можете указать время жизни ссылки (TTL),
              после чего файл будет автоматически удалён.
            </Text>
          </Flex>

          <Divider style={{ margin: "24px 0", backgroundColor:'white' }} />

          <DragNDrop />
        </Col>
      </Row>
    </Flex>
  );
};
