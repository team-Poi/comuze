import { useEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

export default function InfScroll<T>(props: {
  fetchData: (cursor?: any) => Promise<{
    data: T[];
    cursor?: any;
    hasMore?: boolean;
  }>;
  loader?: JSX.Element;
  dataMapper?: (data: T, index: number) => JSX.Element;
  minDataCount?: number;
}) {
  return function InfScrollElement() {
    const [datas, setDatas] = useState<T[]>([]);
    const cursorRef = useRef(null);
    const hasRef = useRef(true);
    const fetchData = () => {
      if (hasRef.current)
        props.fetchData(cursorRef.current).then((v) => {
          setDatas((oldDatas) => [...oldDatas, ...v.data]);
          cursorRef.current = v.cursor;
          let nhm =
            v.hasMore ||
            (props.minDataCount
              ? v.data.length >= props.minDataCount
              : undefined);

          if (nhm == undefined) throw new Error("No has more data has given.");
          hasRef.current = nhm;
        });
    };
    useEffect(() => {
      fetchData();
    }, []);

    return (
      <InfiniteScroll
        dataLength={datas.length}
        next={fetchData}
        hasMore={hasRef.current}
        loader={props.loader || <h4>Loading...</h4>}
      >
        {props.dataMapper
          ? datas.map(props.dataMapper)
          : datas.map((v, i) => {
              return <div key={i}>{JSON.stringify(v)}</div>;
            })}
      </InfiniteScroll>
    );
  };
}
