import { Bubble, InputToolbar } from "react-native-gifted-chat";

export const customtInputToolbar = props => {
  return (
    <InputToolbar
      {...props}
      containerStyle={{
        backgroundColor: "white",
        borderTopColor: "#E8E8E8",
        borderTopWidth: 1,
        padding: 8
      }}
    />
  );
};

export const renderBubble = (props) => {
  return (
    <Bubble
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: selectedColor,
        }
      }}
      textProps={{
        style: {
          color: props.position === 'left' ? '#000' : defaultTextColor,
        },
      }}
      textStyle={{
        left: {
          color: '#000',
        },
        right: {
          color: defaultTextColor,
        },
      }}
      timeTextStyle={{
        left: {
          color: 'black',
        },
        right: {
          color: defaultTextColor,
        },
      }}
    />
  )
}