import { Modal, Input, useNotification } from "web3uikit"
import { useAdContext } from "../contexts/AdContext"

export default function AdSection({ isVisible, onClose }) {
    const dispatch = useNotification()

    // const [bid, setBid] = useState(0)
    const { setAdImage, setAdText } = useAdContext()

    const handleAdSuccess = () => {
        dispatch({
            type: "success",
            message: "Refresh the page to see your ad ",
            title: "Posted an Ad ",
            position: "topR",
        })
        onClose && onClose()
        // setBid("0")
    }

    return (
        <Modal
            isVisible={isVisible}
            onCancel={onClose}
            onCloseButtonPressed={onClose}
            onOk={handleAdSuccess}
            title="Enter Advertisement Details"
        >
            <Input
                label="Ad image URL"
                placeholder="https://..."
                onChange={(event) => {
                    setAdImage(event.target.value)
                }}
            />
            <Input
                label="Ad text (120 characters max)"
                onChange={(event) => {
                    setAdText(event.target.value)
                }}
                validation={{
                    characterMaxLength: 120,
                }}
            />
            <div>
                <br></br>
            </div>
        </Modal>
    )
}
