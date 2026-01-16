terraform {
  backend "s3" {
    bucket         = "ply-reader-terraform-state-bucket"
    key            = "terraform.tfstate"
    region         = "eu-west-3"
  }
}