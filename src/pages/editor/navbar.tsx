import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { dispatch } from "@designcombo/events";
import { HISTORY_UNDO, HISTORY_REDO, DESIGN_RESIZE } from "@designcombo/state";
import logoDark from "@/assets/logo-dark.png";
import { Icons } from "@/components/shared/icons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDown, Download } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { download } from "@/utils/download";
import useAuthStore from "@/store/use-auth-store";
import { useNavigate } from "react-router-dom";
import useFFmpegStore from "@/store/use-ffmpeg-store";

import {
  Cloud,
  CreditCard,
  Github,
  Keyboard,
  LifeBuoy,
  LogOut,
  Mail,
  MessageSquare,
  Plus,
  PlusCircle,
  Settings,
  User,
  UserPlus,
  Users,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useStore from "@/pages/editor/store/use-store";
import { generateId } from "@designcombo/timeline";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const baseUrl = "https://renderer.designcombo.dev";
const size = {
  width: 1080,
  height: 1920,
};
//  https://renderer.designcombo.dev/status/{id}
export default function Navbar() {
  const handleUndo = () => {
    dispatch(HISTORY_UNDO);
  };

  const handleRedo = () => {
    dispatch(HISTORY_REDO);
  };

  const openLink = (url: string) => {
    window.open(url, "_blank"); // '_blank' will open the link in a new tab
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "320px 1fr 320px",
      }}
      className="pointer-events-none absolute left-0 right-0 top-0 z-[205] flex h-[72px] items-center px-2"
    >
      <div className="pointer-events-auto flex h-14 items-center gap-2">
        <div className="flex h-12 w-12 items-center justify-center rounded-md bg-background">
          <img src={logoDark} alt="logo" className="h-5 w-5" />
        </div>
        <div className="flex h-12 items-center bg-background px-1.5">
          <Button
            onClick={handleUndo}
            className="text-muted-foreground"
            variant="ghost"
            size="icon"
          >
            <Icons.undo width={20} />
          </Button>
          <Button
            onClick={handleRedo}
            className="text-muted-foreground"
            variant="ghost"
            size="icon"
          >
            <Icons.redo width={20} />
          </Button>
        </div>
      </div>

      <div className="pointer-events-auto flex h-14 items-center justify-center gap-2">
        <div className="flex h-12 items-center gap-4 rounded-md bg-background px-2.5">
          <div className="px-1 text-sm font-medium">Untitled video</div>
          <ResizeVideo />
        </div>
      </div>

      <div className="pointer-events-auto flex h-14 items-center justify-end gap-2">
        <div className="flex h-12 items-center gap-2 rounded-md bg-background px-2.5">
          <Button
            className="flex gap-2 border border-border"
            onClick={() => openLink("https://discord.gg/jrZs3wZyM5")}
            variant="secondary"
          >
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 640 512"
              height={16}
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M524.531,69.836a1.5,1.5,0,0,0-.764-.7A485.065,485.065,0,0,0,404.081,32.03a1.816,1.816,0,0,0-1.923.91,337.461,337.461,0,0,0-14.9,30.6,447.848,447.848,0,0,0-134.426,0,309.541,309.541,0,0,0-15.135-30.6,1.89,1.89,0,0,0-1.924-.91A483.689,483.689,0,0,0,116.085,69.137a1.712,1.712,0,0,0-.788.676C39.068,183.651,18.186,294.69,28.43,404.354a2.016,2.016,0,0,0,.765,1.375A487.666,487.666,0,0,0,176.02,479.918a1.9,1.9,0,0,0,2.063-.676A348.2,348.2,0,0,0,208.12,430.4a1.86,1.86,0,0,0-1.019-2.588,321.173,321.173,0,0,1-45.868-21.853,1.885,1.885,0,0,1-.185-3.126c3.082-2.309,6.166-4.711,9.109-7.137a1.819,1.819,0,0,1,1.9-.256c96.229,43.917,200.41,43.917,295.5,0a1.812,1.812,0,0,1,1.924.233c2.944,2.426,6.027,4.851,9.132,7.16a1.884,1.884,0,0,1-.162,3.126,301.407,301.407,0,0,1-45.89,21.83,1.875,1.875,0,0,0-1,2.611,391.055,391.055,0,0,0,30.014,48.815,1.864,1.864,0,0,0,2.063.7A486.048,486.048,0,0,0,610.7,405.729a1.882,1.882,0,0,0,.765-1.352C623.729,277.594,590.933,167.465,524.531,69.836ZM222.491,337.58c-28.972,0-52.844-26.587-52.844-59.239S193.056,219.1,222.491,219.1c29.665,0,53.306,26.82,52.843,59.239C275.334,310.993,251.924,337.58,222.491,337.58Zm195.38,0c-28.971,0-52.843-26.587-52.843-59.239S388.437,219.1,417.871,219.1c29.667,0,53.307,26.82,52.844,59.239C470.715,310.993,447.538,337.58,417.871,337.58Z"></path>
            </svg>
            Discord
          </Button>
          <DownloadPopover />
          <UserMenu />
        </div>
      </div>
    </div>
  );
}

const UserMenu = () => {
  const { user, signOut } = useAuthStore();
  const navigate = useNavigate();
  if (!user) {
    return (
      <Button
        onClick={() => navigate("/auth")}
        className="flex h-8 gap-1"
        variant="default"
      >
        Sign in
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="h-8 w-8 cursor-pointer">
          <AvatarImage src={user.avatar} alt="@user" />
          <AvatarFallback>{user.email.slice(0, 2)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mr-2 mt-2 w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Billing</span>
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Keyboard className="mr-2 h-4 w-4" />
            <span>Keyboard shortcuts</span>
            <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Users className="mr-2 h-4 w-4" />
            <span>Team</span>
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <UserPlus className="mr-2 h-4 w-4" />
              <span>Invite users</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem>
                  <Mail className="mr-2 h-4 w-4" />
                  <span>Email</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  <span>Message</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  <span>More...</span>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuItem>
            <Plus className="mr-2 h-4 w-4" />
            <span>New Team</span>
            <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Github className="mr-2 h-4 w-4" />
          <span>GitHub</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <LifeBuoy className="mr-2 h-4 w-4" />
          <span>Support</span>
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          <Cloud className="mr-2 h-4 w-4" />
          <span>API</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={signOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

interface IDownloadState {
  renderId: string;
  progress: number;
  isDownloading: boolean;
  format: string;
  quality: string;
}

const DownloadPopover = () => {
  const [open, setOpen] = useState(false);
  const [downloadState, setDownloadState] = useState<IDownloadState>({
    progress: 0,
    isDownloading: false,
    renderId: "",
    format: "mp4",
    quality: "medium",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const messageRef = useRef<string>("");
  const {
    tracks,
    trackItemIds,
    trackItemsMap,
    trackItemDetailsMap,
    transitionsMap,
    transitionIds,
    fps,
  } = useStore();

  // Use our new FFmpeg store
  const ffmpeg = useFFmpegStore();

  useEffect(() => {
    // Load FFmpeg when component mounts
    if (!ffmpeg.loaded) {
      ffmpeg.load();
    }
  }, [ffmpeg]);

  const handleExport = async () => {
    if (!ffmpeg.loaded) {
      setErrorMessage("");
      setDownloadState({
        ...downloadState,
        isDownloading: true,
        progress: 0,
      });
      await ffmpeg.load();
      setDownloadState(prev => ({
        ...prev,
        isDownloading: false
      }));
      return;
    }

    try {
      setErrorMessage("");
      setDownloadState({
        ...downloadState,
        isDownloading: true,
        progress: 0,
      });
      
      messageRef.current = "Preparing export data...";
      
      const data: any = {
        id: generateId(),
        fps,
        tracks,
        size,
        trackItemDetailsMap,
        trackItemIds,
        transitionsMap,
        trackItemsMap,
        transitionIds,
      };
      
      // Get all media items by type
      const videoItems = Object.values(trackItemsMap).filter(item => item.type === "video");
      const audioItems = Object.values(trackItemsMap).filter(item => item.type === "audio");
      const captionItems = Object.values(trackItemsMap).filter(item => item.type === "caption");
      
      if (videoItems.length === 0) {
        throw new Error("No video content to export");
      }
      
      // Download and prepare primary video
      messageRef.current = "Downloading video assets...";
      const videoItem = videoItems[0];
      const videoResponse = await fetch(videoItem.details.src);
      const videoData = await videoResponse.arrayBuffer();
      await ffmpeg.ffmpeg.writeFile("input.mp4", new Uint8Array(videoData));
      
      // Create subtitle file if we have captions
      if (captionItems.length > 0) {
        messageRef.current = "Preparing captions...";
        let srtContent = "";
        let index = 1;
        
        // Sort captions by their display start time
        const sortedCaptions = captionItems.sort((a, b) => 
          a.display.from - b.display.from
        );
        
        for (const caption of sortedCaptions) {
          const startTime = formatSrtTime(caption.display.from / 1000);
          const endTime = formatSrtTime(caption.display.to / 1000);
          const text = caption.details.text;
          
          srtContent += `${index}\n${startTime} --> ${endTime}\n${text}\n\n`;
          index++;
        }
        
        await ffmpeg.ffmpeg.writeFile("captions.srt", new TextEncoder().encode(srtContent));
      }
      
      // Determine quality settings based on selected quality
      const qualitySettings = getQualitySettings(downloadState.quality);
      
      // Determine output format and file extension
      const outputFormat = downloadState.format;
      const outputExt = outputFormat === "gif" ? "gif" : outputFormat;
      const outputFilename = `output.${outputExt}`;
      
      // Handle audio if available and not exporting to GIF
      if (audioItems.length > 0 && outputFormat !== "gif") {
        messageRef.current = "Downloading audio assets...";
        const audioItem = audioItems[0];
        const audioResponse = await fetch(audioItem.details.src);
        const audioData = await audioResponse.arrayBuffer();
        await ffmpeg.ffmpeg.writeFile("audio.mp3", new Uint8Array(audioData));
        
        // Command to add audio to video
        messageRef.current = "Processing video with audio...";
        const command = [
          "-i", "input.mp4",
          "-i", "audio.mp3"
        ];
        
        // Add subtitles if we created them
        if (captionItems.length > 0 && outputFormat !== "gif") {
          command.push("-vf", "subtitles=captions.srt:force_style='FontName=Arial,FontSize=24,PrimaryColour=&HFFFFFF,BackColour=&H80000000,Outline=0,Shadow=0'");
        }
        
        // Add quality and format specific settings
        if (outputFormat === "mp4") {
          command.push(
            "-c:v", "libx264", 
            "-c:a", "aac",
            "-b:v", qualitySettings.videoBitrate,
            "-b:a", qualitySettings.audioBitrate,
            "-map", "0:v", 
            "-map", "1:a", 
            "-shortest",
            "-pix_fmt", "yuv420p"
          );
        } else if (outputFormat === "webm") {
          command.push(
            "-c:v", "libvpx-vp9",
            "-c:a", "libopus",
            "-b:v", qualitySettings.videoBitrate,
            "-b:a", qualitySettings.audioBitrate,
            "-map", "0:v", 
            "-map", "1:a",
            "-shortest"
          );
        }
        
        command.push(outputFilename);
        await ffmpeg.ffmpeg.exec(command);
      } else {
        // Just process the video with captions if available
        messageRef.current = "Processing video...";
        let filters = [];
        
        if (captionItems.length > 0 && outputFormat !== "gif") {
          filters.push("subtitles=captions.srt:force_style='FontName=Arial,FontSize=24,PrimaryColour=&HFFFFFF,BackColour=&H80000000,Outline=0,Shadow=0'");
        }
        
        const command = ["-i", "input.mp4"];
        
        // Add filters if any
        if (filters.length > 0) {
          command.push("-vf", filters.join(","));
        }
        
        // Add format specific settings
        if (outputFormat === "mp4") {
          command.push(
            "-c:v", "libx264",
            "-b:v", qualitySettings.videoBitrate,
            "-pix_fmt", "yuv420p"
          );
        } else if (outputFormat === "webm") {
          command.push(
            "-c:v", "libvpx-vp9",
            "-b:v", qualitySettings.videoBitrate
          );
        } else if (outputFormat === "gif") {
          messageRef.current = "Creating GIF animation...";
          command.push(
            "-vf", `fps=${fps < 15 ? fps : 15},scale=${qualitySettings.width}:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse`
          );
        }
        
        command.push(outputFilename);
        await ffmpeg.ffmpeg.exec(command);
      }
      
      // Read the output file and create a download URL
      messageRef.current = "Finalizing export...";
      const outputData = await ffmpeg.ffmpeg.readFile(outputFilename);
      const uint8Array = new Uint8Array(outputData as ArrayBuffer);
      const mimeType = getMimeType(outputFormat);
      const blob = new Blob([uint8Array], { type: mimeType });
      const url = URL.createObjectURL(blob);
      
      // Download the file
      messageRef.current = "Download ready!";
      download(url, `video_export_${data.id}.${outputExt}`);
      
      setDownloadState({
        ...downloadState,
        progress: 100,
        isDownloading: false,
      });
      
      setTimeout(() => {
        setOpen(false);
      }, 1000);
    } catch (error) {
      console.error("Export failed:", error);
      setErrorMessage(error instanceof Error ? error.message : "Export failed. Please try again.");
      setDownloadState({
        ...downloadState,
        isDownloading: false,
      });
    }
  };

  // Helper function to format time for SRT format (00:00:00,000)
  const formatSrtTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const milliseconds = Math.floor((seconds % 1) * 1000);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')},${milliseconds.toString().padStart(3, '0')}`;
  };
  
  // Get quality settings based on selected quality
  const getQualitySettings = (quality: string) => {
    switch (quality) {
      case "low":
        return {
          videoBitrate: "1000k",
          audioBitrate: "96k",
          width: 480
        };
      case "high":
        return {
          videoBitrate: "4000k",
          audioBitrate: "192k",
          width: 1080
        };
      case "medium":
      default:
        return {
          videoBitrate: "2000k",
          audioBitrate: "128k",
          width: 720
        };
    }
  };
  
  // Get mime type based on format
  const getMimeType = (format: string) => {
    switch (format) {
      case "webm":
        return "video/webm";
      case "gif":
        return "image/gif";
      case "mp4":
      default:
        return "video/mp4";
    }
  };

  useEffect(() => {
    // Effect for renderId from backend service
    let interval: NodeJS.Timeout;
    if (downloadState.renderId) {
      interval = setInterval(() => {
        fetch(`${baseUrl}/status/${downloadState.renderId}`)
          .then((res) => res.json())
          .then(({ render: { progress, output } }) => {
            if (progress === 100) {
              clearInterval(interval);
              setDownloadState({
                ...downloadState,
                renderId: "",
                progress: 0,
                isDownloading: false,
              });
              download(output, `${downloadState.renderId}`);
              setOpen(false);
            } else {
              setDownloadState({
                ...downloadState,
                progress,
                isDownloading: true,
              });
            }
          });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [downloadState.renderId]);

  // Use FFmpeg progress for UI updates
  useEffect(() => {
    if (ffmpeg.running) {
      setDownloadState(prev => ({
        ...prev,
        progress: Math.floor(ffmpeg.execProgress * 100),
        isDownloading: true
      }));
      messageRef.current = ffmpeg.output;
    }
  }, [ffmpeg.running, ffmpeg.execProgress, ffmpeg.output]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          className="flex h-9 w-9 gap-1 border border-border"
          size="icon"
          variant="secondary"
        >
          <Download width={18} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="z-[250] flex w-60 flex-col gap-4">
        {downloadState.isDownloading || ffmpeg.running ? (
          <>
            <Label>Exporting Video</Label>
            <div className="flex items-center gap-2">
              <Progress
                className="h-2 rounded-sm"
                value={downloadState.progress}
              />
              <div className="rounded-sm border border-border p-1 text-sm text-zinc-400">
                {parseInt(downloadState.progress.toString())}%
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              {messageRef.current}
            </div>
          </>
        ) : (
          <>
            <Label>Export settings</Label>
            
            {errorMessage && (
              <div className="text-xs text-red-500">
                {errorMessage}
              </div>
            )}
            
            <div className="space-y-2">
              <Label className="text-xs">Format</Label>
              <Select
                value={downloadState.format}
                onValueChange={(value) => setDownloadState({...downloadState, format: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mp4">MP4</SelectItem>
                  <SelectItem value="webm">WebM</SelectItem>
                  <SelectItem value="gif">GIF</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label className="text-xs">Quality</Label>
              <Select
                value={downloadState.quality}
                onValueChange={(value) => setDownloadState({...downloadState, quality: value})}
                disabled={downloadState.format === "gif"}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Quality" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
              {downloadState.format === "gif" && (
                <div className="text-xs text-muted-foreground">
                  GIF export uses optimized settings
                </div>
              )}
            </div>
            
            <div>
              <Button onClick={handleExport} className="w-full">
                {ffmpeg.loaded ? "Export" : "Load FFmpeg"}
              </Button>
              {!ffmpeg.loaded && (
                <div className="mt-1 text-xs text-muted-foreground">
                  First use will download and cache FFmpeg (~25MB)
                </div>
              )}
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
};

interface ResizeOptionProps {
  label: string;
  icon: string;
  value: ResizeValue;
  description: string;
}

interface ResizeValue {
  width: number;
  height: number;
  name: string;
}

const RESIZE_OPTIONS: ResizeOptionProps[] = [
  {
    label: "16:9",
    icon: "landscape",
    description: "YouTube ads",
    value: {
      width: 1920,
      height: 1080,
      name: "16:9",
    },
  },
  {
    label: "9:16",
    icon: "portrait",
    description: "TikTok, YouTube Shorts",
    value: {
      width: 1080,
      height: 1920,
      name: "9:16",
    },
  },
  {
    label: "1:1",
    icon: "square",
    description: "Instagram, Facebook posts",
    value: {
      width: 1080,
      height: 1080,
      name: "1:1",
    },
  },
];

const ResizeVideo = () => {
  const handleResize = (options: ResizeValue) => {
    dispatch(DESIGN_RESIZE, {
      payload: {
        ...options,
      },
    });
  };
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="border border-border" variant="secondary">
          Resize
        </Button>
      </PopoverTrigger>
      <PopoverContent className="z-[250] w-60 px-2.5 py-3">
        <div className="text-sm">
          {RESIZE_OPTIONS.map((option, index) => (
            <ResizeOption
              key={index}
              label={option.label}
              icon={option.icon}
              value={option.value}
              handleResize={handleResize}
              description={option.description}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

const ResizeOption = ({
  label,
  icon,
  value,
  description,
  handleResize,
}: ResizeOptionProps & { handleResize: (payload: ResizeValue) => void }) => {
  const Icon = Icons[icon as "text"];
  return (
    <div
      onClick={() => handleResize(value)}
      className="flex cursor-pointer items-center rounded-md p-2 hover:bg-zinc-50/10"
    >
      <div className="w-8 text-muted-foreground">
        <Icon size={20} />
      </div>
      <div>
        <div>{label}</div>
        <div className="text-xs text-muted-foreground">{description}</div>
      </div>
    </div>
  );
};
