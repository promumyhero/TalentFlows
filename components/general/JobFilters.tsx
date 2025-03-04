"use client";
import { XIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { countryList } from "@/app/utils/countriesList";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

const jobTypes = ["Full-Time", "Part-Time", "Contract", "Internship"];

/**
 * Komponen filter untuk halaman utama yang menampilkan daftar lowongan pekerjaan sesuai filter.
 *
 * Komponen ini menerima parameter `searchParams` yang berisi parameter query string
 * berupa `page`, `jobTypes`, dan `location`. Parameter `page` berisi nomor halaman
 * yang akan ditampilkan, parameter `jobTypes` berisi jenis pekerjaan yang akan
 * ditampilkan, dan parameter `location` berisi lokasi pekerjaan yang akan ditampilkan.
 *
 * Komponen ini akan menampilkan daftar lowongan pekerjaan sesuai filter yang diberikan
 * dan akan membuat unique key untuk komponen berdasarkan filter yang diberikan.
 * 
 * @returns {JSX.Element}
 */

export function JobFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // get current filters from url
  const currentJobTypes = searchParams.get("jobTypes")?.split(",") || [];
  const currentLocation = searchParams.get("location") || "";

  
  /**
   * Clears all filters by pushing the user to the home page.
   */
  function clearAllFilters() {
    router.push("/");
  }

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }

      return params.toString();
    },
    [searchParams]
  );

  /**
   * Handles the change of a job type filter.
   *
   * @param {string} type The type of job to filter by.
   * @param {boolean} checked Whether the job type is selected or not.
   */

  const handleJobTypeChange = (type: string, checked: boolean) => {
    const current = new Set(currentJobTypes);
    if (checked) {
      current.add(type);
    } else {
      current.delete(type);
    }

    const newValue = Array.from(current).join(",");
    router.push(`?${createQueryString("jobTypes", newValue)}`);
  };

  
  /**
   * Handles the change of the location filter.
   *
   * @param {string} location The location to filter by.
   */
  function handleLocationChange(location: string) {
    router.push(`?${createQueryString("location", location)}`);
  }

  return (
    <Card className="col-span-1 h-fit">
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle className="text-2xl font-semibold">Filter</CardTitle>
        <Button
          onClick={clearAllFilters}
          variant={"destructive"}
          size={"sm"}
          className="h-8"
        >
          <span>Clear Filters</span>
          <XIcon className="size-4" />
        </Button>
      </CardHeader>
      <Separator className="mb-4" />
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Label className="text-lg font-semibold">Job Type</Label>
          <div className="grid grid-cols-2 gap-4">
            {jobTypes.map((job, index) => (
              <div key={index} className="flex items-center space-x-2 gap-2">
                <Checkbox
                  onCheckedChange={(checked) => {
                    handleJobTypeChange(job, checked as boolean);
                  }}
                  id={job}
                  checked={currentJobTypes.includes(job)}
                />
                <Label className="text-sm font-medium" htmlFor={job}>
                  {job}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <Label className="text-lg font-semibold">Location</Label>
          <Select
            onValueChange={(location) => {
              handleLocationChange(location);
            }}
            value={currentLocation}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a location" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Worldwide</SelectLabel>
                <SelectItem value="Worldwide">
                  <span>🌍</span>
                  <span className="pl-2">Worldwide / Remote</span>
                </SelectItem>
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>Location</SelectLabel>
                {countryList.map((country) => (
                  <SelectItem key={country.code} value={country.name}>
                    <span>{country.flagEmoji}</span>
                    <span className="pl-2">{country.name}</span>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
