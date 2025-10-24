"use client";
import { FC } from "react";
import { Flex, Button, Typography, Row, Col, Modal } from "antd";
import Title from "antd/es/typography/Title";

const { Text } = Typography;

interface LinkPageIO {
  classname?: string;
  filename?: string;
  secret?: string;
}

export const LinkPage: FC<LinkPageIO> = (props: LinkPageIO) => {
  const { filename, secret } = props;

  const saveFile = async () => {
    try {
      const response = await fetch(
        `/api/download?filename=${filename}&secret=${secret}`,
        { method: "GET" }
      );

      if (response.ok) {
        const data = await response.blob();
        const url = window.URL.createObjectURL(data);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename || "file";
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      } else {
        Modal.error({
          title: "Ошибка при скачивании",
          content: "Файл не найден или срок его действия истёк.",
        });
      }
    } catch (error) {
      console.error("Ошибка при загрузке файла", error);
      Modal.error({
        title: "Ошибка сети",
        content: "Не удалось скачать файл. Попробуйте позже.",
      });
    }
  };

  return (
    <Flex
      vertical
      align="center"
      justify="center"
      style={{
        minHeight: "100vh",
        background: "#7cb1e7ff",
        padding: "40px 20px",
      }}
    >
      <Row
        justify="center"
        style={{
          width: "100%",
          maxWidth: 600,
          background: "#fff",
          borderRadius: 16,
          padding: "40px 32px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        }}
      >
        <Col span={24}>
          <Flex vertical align="center" gap={16}>
            <Title level={3} style={{ marginBottom: 0 }}>
              Скачать файл
            </Title>

            <Text type="secondary">
              Используйте ссылку для безопасного получения вашего файла.
            </Text>

            <Flex
              vertical
              align="center"
              style={{
                background: "#fafafa",
                border: "1px solid #f0f0f0",
                borderRadius: 8,
                padding: "16px 20px",
                width: "100%",
                marginTop: 16,
              }}
            >
              <Text strong>Имя файла:</Text>
              <Text code style={{ fontSize: 15, color: "#1677ff" }}>
                {filename || "Не указано"}
              </Text>
            </Flex>

            <Button
              type="primary"
              size="large"
              onClick={saveFile}
              style={{
                marginTop: 24,
                borderRadius: 8,
                padding: "0 24px",
                fontWeight: 500,
              }}
            >
              Скачать
            </Button>

            <Text type="secondary" style={{ marginTop: 16, fontSize: 12 }}>
              ⚠ Ссылка активна ограниченное время. После истечения срока действия
              файл будет удалён с сервера.
            </Text>
          </Flex>
        </Col>
      </Row>
    </Flex>
  );
};
