import React, { useEffect, useRef, useState } from "react";
import { Form, useLocation, useNavigate } from "react-router";

import { SpaceProps } from "@/components/components.d";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// import modalStore from "@/store/modal";

export const SearchInput: React.FC<SpaceProps> = ({ query }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [isSearching, setIsSearching] = useState(false);
  const [searchType, setSearchType] = useState(query?.in ?? "title");
  const [inputValue, setInputValue] = useState("");
  // const { pushModals } = modalStore();

  const inputRef = useRef<HTMLInputElement>(null);

  const changeEventHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event?.target?.value);
  };

  const keywordEventHandler = (
    event: React.MouseEvent<HTMLButtonElement> & React.KeyboardEvent<HTMLInputElement>
  ) => {
    setIsSearching(true);
    if (event.key === "Enter" || event.type === "click") {
      if (!inputRef?.current?.value && inputValue === "") {
        navigate("/space");
        event.preventDefault();
      }
      // 모달 스택 확인 : 아래 pushModals 복제하여 테스트
      // pushModals({ message: "검색어를 입력하세요.", type: "alert", prevRef: inputRef });
    }
  };

  useEffect(() => {
    setIsSearching(false);
  }, [location.key]);

  useEffect(() => {
    if (inputRef.current && query?.keyword) {
      inputRef.current.value = query?.keyword ?? "";
    }
  }, [query?.keyword]);

  return (
    <div className="my-4 flex flex-col md:flex-row justify-between gap-4">
      <div className="flex flex-col md:flex-row gap-4 w-full">
        {/* method 가 GET 이므로 Submit 후 url params 로 검색 */}
        <Form className="flex w-full md:max-w-md gap-2 md:gap-4" method={"GET"}>
          <input type="hidden" name="in" value={searchType} />
          <Select onValueChange={(value) => setSearchType(value)} defaultValue={searchType}>
            <SelectTrigger className="w-28">
              <SelectValue placeholder="" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="title">제목</SelectItem>
                <SelectItem value="body">내용</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Input
            className="w-full"
            type="text"
            name="keyword"
            ref={inputRef}
            onChange={changeEventHandler}
            placeholder="단어로만 검색 가능"
          />
          <Button className="w-20 text-xs md:text-sm" type="submit" onClick={keywordEventHandler}>
            {isSearching ? (
              <div className="animate-spin rounded-full absolute inline mx-4">|</div>
            ) : (
              "검색"
            )}
          </Button>
        </Form>
      </div>
      <Button className="w-full md:w-20 text-xs md:text-sm">
        <a
          href={`https://github.com/${import.meta.env.VITE_APP_GIT_OWNER}/${
            import.meta.env.VITE_APP_GIT_REPO
          }/issues/new`}
          target="_blank"
        >
          글쓰기
        </a>
      </Button>
    </div>
  );
};
