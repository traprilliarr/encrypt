"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

import Modal from "../Modal";
import Input from "../input/Input";

interface SettingsModalProps {
  currentUser: any;
  isOpen?: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  currentUser,
  isOpen,
  onClose,
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    getValues,
  } = useForm<FieldValues>({
    defaultValues: {
      fullname: currentUser?.fullname,
      // image: currentUser?.image,
    },
  });

  const image = watch("image");

  const handleUpload = (result: any) => {
    setValue("image", result?.info?.secure_url, {
      shouldValidate: true,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div>
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Profile
            </h2>

            <p className="mt-1 text-sm leading-6 text-gray-600">
              Edit your profile details.
            </p>

            <div className="mt-10 flex flex-col gap-y-8">
              <Input
                disabled={isLoading}
                label="Nama Lengkap"
                id="fullname"
                errors={errors}
                register={register}
                required
              />

              <div>
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  Photo
                </label>
                <div className="mt-2 flex items-center gap-x-3">
                  <Image
                    width={48}
                    height={48}
                    src={image || "/images/avatar.jpg"}
                    alt="avatar"
                    className="rounded-full"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* <div className="mt-6 flex items-center justify-end gap-x-6">
            <Button disabled={isLoading} onClick={onClose} secondary>
              Cancel
            </Button>
            <Button disabled={isLoading} type="submit">
              Save
            </Button>
          </div> */}
        </div>
      </div>
    </Modal>
  );
};

export default SettingsModal;
