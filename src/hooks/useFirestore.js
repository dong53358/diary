import { addDoc, collection, deleteDoc, doc } from "firebase/firestore";
import { useReducer } from "react";
import { appFireStore, timestamp } from "../firebase/config";

const iniState = {
  document: null,
  isPending: false,
  error: null,
  success: false,
};

const storeReducer = (state, action) => {
  switch (action.type) {
    case "isPending":
      return { ispending: true, document: null, success: false, error: null };
    case "addDoc":
      return {
        ispending: false,
        document: action.payload,
        success: true,
        error: null,
      };
    case "error":
      return {
        ispending: false,
        document: null,
        success: false,
        error: action.payload,
      };
    case "deleteDoc":
      return {
        ispending: false,
        document: action.payload,
        success: true,
        error: null,
      };
    default:
      return state;
  }
};

// 저장할 컬렌션을 인자로 전달합니다.
export const useFirestore = (transaction) => {
  const [response, dispatch] = useReducer(storeReducer, iniState);

  // colRef : 컬렉션의 참조를 요구합니다.
  const colRef = collection(appFireStore, transaction);

  // 컬렉션에 문서를 추가합니다.
  const addDocument = async (doc) => {
    dispatch({ type: "isPending" });
    try {
      const createdTime = timestamp.fromDate(new Date());
      const docRef = await addDoc(colRef, { ...doc, createdTime });
      dispatch({ type: "addDoc", payload: docRef });
    } catch (error) {
      dispatch({ type: "error", payload: error.message });
    }
  };

  // 컬렉션에서 문서를 제거합니다.
  const deleteDocument = async (id) => {
    dispatch({ type: "isPending" });
    try {
      const docRef = await deleteDoc(doc(colRef, id));
      dispatch({ type: "deleteDoc", payload: docRef });
    } catch (error) {
      dispatch({ type: "error", payload: error.message });
    }
  };

  return { addDocument, deleteDocument, response };
};
