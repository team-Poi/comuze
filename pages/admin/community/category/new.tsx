import Header from "@/components/Header";
import { Conatiner } from "@/components/Container";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import styles from "@/styles/community/new.module.css";
import common from "@/styles/common.module.css";
import classNames from "@/utils/classNames";
import optCSS from "@/utils/optCSS";
import { Loading } from "@/components/Loading";
import { Saero } from "@/components/Saero";
import { toast } from "react-toastify";
import { Garo } from "@/components/Garo";

interface Category {
  id: number;
  name: string;
}

export default function New() {
  const editorRef = useRef(null);
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [category, setCategory] = useState(1);

  useEffect(() => {
    (async () => {
      let x = await axios.get("/api/community/category/getlist");
      if (!x.data.s) return;
      setCategories(x.data.data as Category[]);
    })();
  }, []);

  useEffect(() => {
    /* Only For Development */
    if (!window) return;
    (window as any).setCategory = setCategory;
    (window as any).setTitle = setTitle;
    (window as any).setLoaded = setLoaded;
  }, []);
  return (
    <>
      <Header type="MAIN" />
      <Conatiner
        style={{
          position: "relative",
        }}
      >
        <h2>카테고리 추가</h2>

        <Input
          value={title}
          onChange={(e) => setTitle(e.currentTarget.value)}
          placeholder="제목"
          maxLength={24}
        />
        <Button
          onClick={() => {
            axios
              .post("/api/admin/community/category/new", {
                title: title,
              })
              .then((e) => {
                if (!e.data.s) {
                  return toast.error(e.data.e);
                }
                toast.success("카테고리를 생성하였습니다!");
              });
          }}
          css={{
            marginTop: "1rem",
          }}
        >
          추가
        </Button>
      </Conatiner>
    </>
  );
}
