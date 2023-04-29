import { Analytics } from "@vercel/analytics/react";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import FileCopyIcon from "@mui/icons-material/FileCopyOutlined";
import SaveIcon from "@mui/icons-material/Save";
import PrintIcon from "@mui/icons-material/Print";
import ShareIcon from "@mui/icons-material/Share";
import { Alert, AlertColor, Snackbar } from "@mui/material";

const inter = Inter({ subsets: ["latin"] });

interface State {
  open: boolean;
  message: string;
  type: AlertColor;
}

export default function Home() {
  const [text, setText] = useState("");
  const [state, setState] = useState<State>({
    open: false,
    message: "",
    type: "success",
  });

  const handleClose = () => {
    setState({ open: false, message: "", type: "success" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handlePrint = () => {
    const doc = new jsPDF();
    doc.text(text, 10, 10);
    const namePdfFile = `${new Date().toLocaleDateString()}-textOnline.pdf`;
    doc.save(namePdfFile);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setState({ open: true, message: "Copied to clipboard", type: "success" });
  };

  const handleSave = () => {
    localStorage.setItem("text", text);
    setState({
      open: true,
      message: "Saved to local storage",
      type: "success",
    });
  };

  const handleShare = async () => {
    if (navigator.share === undefined)
      return setState({ open: true, message: "Not supported", type: "error" });
    try {
      await window.navigator.share({
        title: "Share from text-online",
        text: text,
        url: "",
      });

      setState({ open: true, message: "Shared successfully", type: "success" });
    } catch (error: any) {
      setState({
        open: true,
        message: `Error sharing - ${error.message} `,
        type: "error",
      });
    }
  };

  useEffect(() => {
    const text = localStorage.getItem("text");
    if (text) {
      setText(text);
    }
  }, []);

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <textarea
        id="textarea"
        onChange={handleChange}
        defaultValue={text}
      ></textarea>
      <SpeedDial
        ariaLabel="SpeedDial basic example"
        sx={{ position: "fixed", bottom: 30, right: 50 }}
        className="speeddial"
        icon={<SpeedDialIcon className="speeddialicon" />}
      >
        <SpeedDialAction
          key={"Copy"}
          icon={<FileCopyIcon />}
          tooltipTitle={"Copy"}
          onClick={handleCopy}
        />
        <SpeedDialAction
          key={"Save"}
          icon={<SaveIcon />}
          tooltipTitle={"Save"}
          onClick={handleSave}
        />
        <SpeedDialAction
          key={"Print"}
          icon={<PrintIcon />}
          tooltipTitle={"Print"}
          onClick={handlePrint}
        />
        <SpeedDialAction
          key={"Share"}
          icon={<ShareIcon />}
          tooltipTitle={"Share"}
          onClick={handleShare}
        />
      </SpeedDial>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={state.open}
        onClose={handleClose}
        autoHideDuration={2000}
        message={state.message}
        key={"top" + "right"}
      >
        <Alert
          onClose={handleClose}
          severity={state.type}
          sx={{ width: "100%" }}
        >
          {state.message}
        </Alert>
      </Snackbar>
      <Analytics />
    </main>
  );
}
