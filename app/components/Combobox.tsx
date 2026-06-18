"use client";

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

function ComboboxElement(props: {
  placeholder: string;
  items: Array<{
    key: string;
    value: string;
  }>;
  uri: string;
  onSelectChange: (value: string) => void;
}) {
  const searchParams = useSearchParams();
  const pageSize = searchParams.get("pageSize")?? 10;
  const [comboboxItem, setComboboxItem] = useState(pageSize);
  return (
    <Combobox items={props.items}>
      <ComboboxInput placeholder={props.placeholder} />
      <ComboboxContent>
        <ComboboxEmpty>No items found.</ComboboxEmpty>
        <ComboboxList>
          {props.items.map((item) => (
            <ComboboxItem
              key={item.key}
              value={comboboxItem}
              onClick={() => {
                props.onSelectChange(item.value);
              }}
            >
              {item.value}
            </ComboboxItem>
          ))}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}

export { ComboboxElement as Combobox };
