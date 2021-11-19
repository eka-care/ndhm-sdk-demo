import Head from "next/head";
import Image from "next/image";
import ChevronDown from "../../../public/assets/chevron-down.svg";
import CircleSolid from "../../../public/assets/circle-solid.svg";
import Backspace from "../../../public/assets/backspace-solid.svg";
import CheckCircleSolid from "../../../public/assets/check-circle-solid.svg";
import RippleButton from "../../../components/ripple-button";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ExclaimationTriangleSolid from "../../../public/assets/exclamation-triangle-solid.svg";

const arrayToBeRendered = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

export default function Home({
  randomizedArray = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 0]),
}) {
  const [keyboardArray, setKeyboardArray] = useState(randomizedArray);
  const [uhiPinLen, setUhiPinLen] = useState(4);
  const [arrayIndex, setArrayIndex] = useState(0);
  const [uhiPin, setUhiPin] = useState([]);
  const [error, setError] = useState("");

  const router = useRouter();
  const { query } = router;
  const { transaction_id = "" } = query;

  useEffect(() => {
    const tempKeyboardArray = [...keyboardArray];
    const temp = tempKeyboardArray[9];
    if (!tempKeyboardArray[11]) {
      tempKeyboardArray[9] = (
        <div className={"flex justify-center"}>
          <Backspace className={"w-7 h-7"} />
        </div>
      );

      tempKeyboardArray[10] = temp;

      tempKeyboardArray[11] = (
        <div className={"flex justify-center"}>
          <CheckCircleSolid className={`w-7 h-7`} />
        </div>
      );
      setKeyboardArray(tempKeyboardArray);
    }
  }, []);

  const enterNumber = (num) => {
    return () => {
      const array = [...uhiPin];
      if (array.length !== uhiPinLen) {
        array.push(num);
        setArrayIndex(arrayIndex + 1);
      }
      setUhiPin(array);
    };
  };

  const backSpace = () => {
    setError("");
    const array = [...uhiPin];
    if (array.length === 1) {
      setUhiPin([]);
    } else {
      array.pop();
      setUhiPin(array);
    }
    setArrayIndex(arrayIndex - 1 > 0 ? arrayIndex - 1 : 0);
  };

  const submit = async () => {
    const uhiPinToBeSubmitted = [...uhiPin];
    if (uhiPinToBeSubmitted.length < uhiPinLen) {
      return;
    }
    const pin = uhiPinToBeSubmitted.join("");
    const response = await fetch("/api/transaction/verify-transaction", {
      method: "POST",
      body: JSON.stringify({ uhiPin: pin, transaction_id: transaction_id }),
      headers: {
        "content-type": "application/json",
      },
    }).then((res) => res.json());

    if (response.success) {
      //call bridge
    } else {
      setError(response.message);
    }
  };

  return (
    <>
      <Head>
        <title>UHI Consent PIN</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={"w-screen h-screen flex flex-col font-sans"}>
        <div
          className={
            "bg-gray-100 h-20 flex justify-between px-4 items-center sticky top-0"
          }
        >
          <span className={"text-xl font-bold text-gray-700 capitalize"}>
            Eka.care Hospital
          </span>
          <Image
            src={"/assets/national-health-authority.png"}
            height={47}
            width={76}
          />
        </div>
        <div
          className={"bg-blue-900 h-10 flex items-center justify-between px-4"}
        >
          <span className={"text-gray-100 text-sm"}>Vishwa Vignesh</span>
          <div className={"text-gray-300 text-xs flex space-x-1 items-center"}>
            {transaction_id}
          </div>
        </div>
        <div
          className={"h-full pt-20 flex flex-col justify-between items-center"}
        >
          <div className={"flex flex-col space-y-4 px-10"}>
            <p className={"font-bold text-lg text-center"}>
              Enter Your UHI PIN{" "}
            </p>
            <div className={"flex space-x-2 justify-center"}>
              <PinHandler
                nums={uhiPin}
                pinLength={uhiPinLen}
                index={arrayIndex}
                errorState={!!error}
              />
            </div>
            <div
              className={`px-3 py-1 flex flex-row space-x-2 bg-red-200 text-red-500 items-center rounded-lg ${
                !!error ? "" : "opacity-0"
              }`}
            >
              <ExclaimationTriangleSolid className={"w-7 h-7"} />
              <p className={"text-sm"}>{error}</p>
            </div>
          </div>
          <div className={"flex flex-col"}>
            <div
              className={
                "grid grid-cols-3 text-center text-blue-900 font-bold text-2xl w-screen mt-auto divide-x-2 divide-y-2 bg-gray-50 shadow-top "
              }
            >
              {keyboardArray.map((ele, idx) => {
                return (
                  <RippleButton
                    className={
                      idx === 0
                        ? "col-span-1 min-h-10 border-t-2 border-l-2"
                        : ""
                    }
                    onClick={
                      idx === 9
                        ? backSpace
                        : idx === 11
                        ? submit
                        : enterNumber(ele)
                    }
                    disabled={idx === 11 && uhiPinLen !== uhiPin.length}
                  >
                    {ele}
                  </RippleButton>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <style jsx>
        {`
          .min-h-10 {
            min-height: 60px;
            height: 40px;
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .shadow-top {
            box-shadow: 0px 1px 25px 0px rgb(156 163 175);
          }
        `}
      </style>
    </>
  );
}

const PinHandler = ({ nums, pinLength, index, errorState = false }) => {
  /* Nums is array of pin num */
  const array = Array.from(Array(pinLength).keys());
  return (
    <>
      {array.map((ele, idx) => {
        return (
          <PinSection
            num={nums[idx] !== undefined && nums[idx] !== "" ? nums[idx] : ""}
            showNum={true}
            active={idx < index}
            errorState={errorState}
          />
        );
      })}
    </>
  );
};

const PinSection = ({
  num = "",
  showNum,
  active = false,
  errorState = false,
}) => {
  return (
    <div className={"flex flex-col space-y-1 text-center text-xl"}>
      <div className={"w-7 h-7"}>
        <div
          className={`${
            errorState ? "text-red-600" : "text-blue-900"
          } font-extrabold`}
        >
          {showNum ? (
            num
          ) : num !== "" ? (
            <div className={"p-1"}>
              <CircleSolid className={"w-5 h-5"} />
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
      <div
        className={`h-1 ${
          active ? (errorState ? "bg-red-600" : "bg-blue-900") : "bg-gray-300"
        } rounded`}
      ></div>
    </div>
  );
};

export async function getServerSideProps(context) {
  return {
    props: {
      randomizedArray: shuffle(arrayToBeRendered),
    },
  };
}
