import { Button } from "@/components/ui/button";
import { GithubIcon, Star } from "lucide-react";
import Link from "next/link";
import { getStars } from '@/actions/github-stars';

const GithubStarsButton = async () => {
  const stars = await getStars();

  return (
    <Button
        variant="outline"
        size="sm"
        asChild
        className="relative overflow-hidden rounded-full border-secondary"
    >
      <Link href="https://github.com/cygnuxxs/lumina-ui" target="_blank" className="flex items-center gap-2">
        <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_2s_infinite] bg-linear-to-r from-transparent via-white/10 to-transparent" />

        <span className="font-medium flex items-center gap-2 text-xs text-muted-foreground group-hover:text-foreground transition-colors">
            <GithubIcon /> Stars
        </span>
        <span className="flex items-center gap-1 font-bold">
            <Star className="w-3.5 h-3.5 fill-primary text-primary" />
            {stars}
        </span>
      </Link>
    </Button>
  )
}

export default GithubStarsButton