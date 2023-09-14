import { useRef, useEffect } from "react";

export function getSectionListData(data) {
  let newData = [];
  data.map(item => {
    let obj = newData.find(
      x =>
        x.name == item.category.charAt(0).toUpperCase() + item.category.slice(1)
    );
    if (obj) {
      newData[newData.indexOf(obj)].data.push({
        id: item.id,
        name: item.name,
        price: item.price,
        description: item.description,
        image: item.image,
      });
    } else {
      newData.push({
        name: item.category.charAt(0).toUpperCase() + item.category.slice(1),
        data: [
          {
            id: item.id,
            name: item.name,
            price: item.price,
            description: item.description,
            image: item.image,
          },
        ],
      });
    }
  });
  return newData;
}

export function useUpdateEffect(effect, dependencies = []) {
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      return effect();
    }
  }, dependencies);
}