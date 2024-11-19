import Particles from "@/components/ui/particles";
import { AuthModal } from "./AuthModal";

export function Hero() {
  return (
    <>
      <div className="flex flex-col justify-center items-center h-screen">
        <Particles className="absolute h-screen w-[100%]" />
        <div className="text-center text-7xl">
          Traveling made <br />
          <span className="text-primary">Safe</span> and
          <span className="text-primary"> Planned</span>!
        </div>
        <div className="text-center text-xl mt-5">
          Scheduling before traveling with unpredictable weathers can be
          complicated, <br />
          but <span className="text-primary">CuacaID</span> will help track your
          travel.
        </div>
        <div className="mt-7">
          <AuthModal />
        </div>
      </div>
    </>
  );
}
