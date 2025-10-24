import { useState } from "react";
import { Flex, InputNumber, Typography } from "antd";

const { Text } = Typography;

interface TTLSelectorProps {
  ttl: number;
  onChange: (seconds: number) => void;
}

export const TTLSelector: React.FC<TTLSelectorProps> = ({ ttl, onChange }) => {
  const hours = Math.floor(ttl / 3600);
  const minutes = Math.floor((ttl % 3600) / 60);
  const seconds = ttl % 60;

  const handleChange = (h: number, m: number, s: number) => {
    const total = h * 3600 + m * 60 + s;
    onChange(total);
  };

  return (
    <Flex align="center" gap={12} style={{ flexWrap: "wrap" }}>
      <Flex vertical align="center">
        <InputNumber
          min={0}
          max={23}
          value={hours}
          onChange={(v) => handleChange(v || 0, minutes, seconds)}
          style={{ width: 80 }}
        />
        <Text type="secondary" style={{ fontSize: 12 }}>
          часы
        </Text>
      </Flex>

      <Flex vertical align="center">
        <InputNumber
          min={0}
          max={59}
          value={minutes}
          onChange={(v) => handleChange(hours, v || 0, seconds)}
          style={{ width: 80 }}
        />
        <Text type="secondary" style={{ fontSize: 12 }}>
          минуты
        </Text>
      </Flex>

      <Flex vertical align="center">
        <InputNumber
          min={0}
          max={59}
          value={seconds}
          onChange={(v) => handleChange(hours, minutes, v || 0)}
          style={{ width: 80 }}
        />
        <Text type="secondary" style={{ fontSize: 12 }}>
          секунды
        </Text>
      </Flex>
    </Flex>
  );
};
