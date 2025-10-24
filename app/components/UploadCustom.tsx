"use client";
import { Button, Flex, Input, Modal, Typography, Divider } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import React, { FC, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addFiles, clearFiles, setUploadStatus } from "../red/slices/filesSlice";
import { RootState } from "../red/store";
import {TTLSelector} from "./TTLSelector";

const { Title, Text } = Typography;

interface ResponseIO {
  filename: string;
  secret: string;
}

export const DragNDrop: FC = () => {
  const URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const dispatch = useDispatch();
  const storedFiles = useSelector((state: RootState) => state.files.files);
  const uploadStatus = useSelector(
    (state: RootState) => state.files.uploadStatus
  );
  const [ttl, setTtl] = useState<number>(3600);
  const [isDragOver, setIsDragOver] = useState(false);
  const [actualFiles, setActualFiles] = useState<File[]>([]);
  const [reqUrl, setReqUrl] = useState<string>("");
  const [modalLink, setModalLinkOpen] = useState(false);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);

    setActualFiles((prev) => [...prev, ...files]);

    const fileInfos = files.map((file) => ({
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
    }));
    dispatch(addFiles(fileInfos));
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleUrl = (data: ResponseIO) => {
    setReqUrl(`${URL}/download?filename=${data.filename}&secret=${data.secret}`);
    setModalLinkOpen(true);
  };

  const handleUpload = async () => {
    if (actualFiles.length === 0) return;

    dispatch(setUploadStatus("uploading"));
    const formData = new FormData();

    actualFiles.forEach((file) => {
      formData.append("file", file);
    });
    formData.append("ttl", ttl.toString());

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data: ResponseIO = await response.json();
        handleUrl(data);
        dispatch(setUploadStatus("success"));
        Modal.success({
          title: "✅ Файл успешно загружен",
          content: "Ссылка доступна в следующем окне",
        });
        dispatch(clearFiles());
        setActualFiles([]);
      } else {
        dispatch(setUploadStatus("error"));
        Modal.error({
          title: "Ошибка при загрузке",
          content: "Проверьте соединение или попробуйте позже",
        });
      }
    } catch (error) {
      dispatch(setUploadStatus("error"));
      console.error("Ошибка при загрузке", error);
      Modal.error({
        title: "Ошибка сети",
        content: "Не удалось отправить файл",
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
        background: "#137ee8ff",
        padding: "40px 20px",
      }}
    >
      <Flex
        vertical
        className="upload-card"
        style={{
          maxWidth: 600,
          width: "100%",
          background: "#fff",
          borderRadius: 16,
          padding: 32,
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        }}
        gap={16}
      >
        <Title level={3} style={{ textAlign: "center" }}>
          Загрузить файл
        </Title>

        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => document.getElementById("fileInput")?.click()}
          style={{
            border: isDragOver ? "2px dashed #1677ff" : "2px dashed #d9d9d9",
            borderRadius: 8,
            padding: "40px 20px",
            textAlign: "center",
            backgroundColor: isDragOver ? "#f0f8ff" : "#fafafa",
            cursor: "pointer",
            transition: "0.3s",
          }}
        >
          <UploadOutlined
            style={{ fontSize: 32, color: "#1677ff", marginBottom: 8 }}
          />
          <div style={{ fontSize: 16, color: "#555" }}>
            Перетащите файл сюда или кликните для выбора
          </div>
          <input
            id="fileInput"
            type="file"
            hidden
            onChange={(e) => {
              if (!e.target.files) return;
              const files = Array.from(e.target.files);
              setActualFiles(files);
              dispatch(
                addFiles(
                  files.map((file) => ({
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    lastModified: file.lastModified,
                  }))
                )
              );
            }}
          />
        </div>

        {storedFiles.length > 0 && (
          <div
            style={{
              marginBottom: "16px",
              background: "#fafafa",
              borderRadius: 8,
              padding: "12px 16px",
              border: "1px solid #f0f0f0",
            }}
          >
            <Text strong>Выбранные файлы ({storedFiles.length}):</Text>
            {storedFiles.map((file, index) => (
              <div
                key={index}
                style={{
                  fontSize: "13px",
                  color: "#555",
                  marginTop: 4,
                }}
              >
                {file.name} —{" "}
                <Text type="secondary">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </Text>
              </div>
            ))}
          </div>
        )}

        <Divider />

        <Flex align="center" justify="space-between" gap={8}>
          <Flex vertical gap={4} style={{ marginBottom: 12 }}>
                <Text strong>Время жизни файла:</Text>
                <TTLSelector ttl={ttl} onChange={setTtl} />
          </Flex>

          <Button
            type="primary"
            onClick={handleUpload}
            disabled={
              actualFiles.length === 0 ||
              uploadStatus === "uploading" ||
              actualFiles.length > 1
            }
            loading={uploadStatus === "uploading"}
          >
            {uploadStatus === "uploading" ? "Загрузка..." : "Отправить"}
          </Button>
        </Flex>

        {actualFiles.length > 1 && (
          <div
            style={{
              background: "#fffbe6",
              border: "1px solid #ffe58f",
              borderRadius: 8,
              padding: 12,
              marginTop: 12,
            }}
          >
            <Text type="warning">
              ⚠ Для безопасности можно загружать только один файл за раз.
            </Text>
          </div>
        )}
      </Flex>

      {/* Модалка со ссылкой */}
      <Modal
        title="🔗 Ссылка на ваш файл"
        open={modalLink}
        onCancel={() => setModalLinkOpen(false)}
        footer={null}
        centered
      >
        <Flex vertical gap={8}>
          <Input
            value={reqUrl}
            readOnly
            addonAfter={
              <Button
                onClick={() => navigator.clipboard.writeText(reqUrl)}
                type="default"
              >
                Скопировать
              </Button>
            }
          />
          <Text type="secondary" style={{ marginTop: 8 }}>
            Ссылка действительна ограниченное время и исчезнет после TTL.
          </Text>
        </Flex>
      </Modal>
    </Flex>
  );
};
