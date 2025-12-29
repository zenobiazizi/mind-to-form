import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, Download, Check, Link2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';

interface ShareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  publishUrl?: string;
  isPublished?: boolean;
}

const ShareModal: React.FC<ShareModalProps> = ({ open, onOpenChange, publishUrl, isPublished }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    if (!publishUrl) return;
    try {
      await navigator.clipboard.writeText(publishUrl);
      setCopied(true);
      toast({
        title: '链接已复制',
        description: '表单链接已复制到剪贴板',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: '复制失败',
        description: '请手动复制链接',
        variant: 'destructive',
      });
    }
  };

  const handleDownloadQR = () => {
    const svg = document.getElementById('qr-code-svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width * 2;
      canvas.height = img.height * 2;
      ctx?.scale(2, 2);
      ctx?.drawImage(img, 0, 0);
      
      const link = document.createElement('a');
      link.download = 'form-qrcode.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  if (!publishUrl || !isPublished) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Link2 className="w-5 h-5 text-primary" />
            分享表单
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* URL Section */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">表单链接</label>
            <div className="flex gap-2">
              <Input
                value={publishUrl}
                readOnly
                className="flex-1 text-sm"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopy}
                className="shrink-0"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          {/* QR Code Section */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">二维码</label>
            <div className="flex flex-col items-center gap-4 p-6 bg-white rounded-xl">
              <QRCodeSVG
                id="qr-code-svg"
                value={publishUrl}
                size={180}
                level="H"
                includeMargin
              />
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={handleDownloadQR}
            >
              <Download className="w-4 h-4 mr-2" />
              下载二维码
            </Button>
          </div>

          {/* Tips */}
          <p className="text-xs text-muted-foreground text-center">
            用户可通过链接或扫描二维码填写表单
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareModal;
