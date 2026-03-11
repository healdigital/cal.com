import classNames from "@calcom/ui/classNames";
import Image from "next/image";

export function Logo({
  small,
  icon,
  inline = true,
  className,
  src = "/api/logo",
}: {
  small?: boolean;
  icon?: boolean;
  inline?: boolean;
  className?: string;
  src?: string;
}) {
  return (
    <h3 className={classNames("logo", inline && "inline", className)}>
      <strong>
        {icon ? (
          <Image
            className="mx-auto w-9 dark:invert"
            alt="Cal"
            title="Cal"
            src={`${src}?type=icon`}
            width={36}
            height={36}
          />
        ) : (
          <Image
            className={classNames(small ? "h-4 w-auto" : "h-5 w-auto", "dark:invert")}
            alt="Cal"
            title="Cal"
            src={src}
            width={120}
            height={20}
          />
        )}
      </strong>
    </h3>
  );
}
