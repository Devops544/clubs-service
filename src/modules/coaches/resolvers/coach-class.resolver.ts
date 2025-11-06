import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CoachClassService } from '../services/coach-class.service';
import { CoachClass } from '../entities/coach-class.entity';
import { CreateCoachClassInput } from '../dto/create-coach-class.input';
import { UpdateCoachClassInput } from '../dto/update-coach-class.input';
import { CoachClassFilterInput } from '../dto/coach-class-filter.input';

@Resolver(() => CoachClass)
export class CoachClassResolver {
  constructor(private readonly coachClassService: CoachClassService) {}

  @Mutation(() => CoachClass)
  async createCoachClass(
    @Args('createCoachClassInput') createCoachClassInput: CreateCoachClassInput,
  ): Promise<CoachClass> {
    return this.coachClassService.create(createCoachClassInput);
  }

  @Query(() => [CoachClass], { name: 'coachClasses' })
  async findAllCoachClasses(@Args('filter') filter: CoachClassFilterInput): Promise<CoachClass[]> {
    const result = await this.coachClassService.findAll(filter);
    return result.data;
  }

  @Query(() => Int, { name: 'coachClassesCount' })
  async getCoachClassesCount(@Args('filter') filter: CoachClassFilterInput): Promise<number> {
    const result = await this.coachClassService.findAll(filter);
    return result.total;
  }

  @Query(() => CoachClass, { name: 'coachClass' })
  async findOneCoachClass(
    @Args('id') id: string,
    @Args('clubId') clubId: string,
  ): Promise<CoachClass> {
    return this.coachClassService.findOne(id, clubId);
  }

  @Query(() => [CoachClass], { name: 'coachClassesByCoach' })
  async findCoachClassesByCoach(
    @Args('coachId') coachId: string,
    @Args('clubId') clubId: string,
  ): Promise<CoachClass[]> {
    return this.coachClassService.findByCoachId(coachId, clubId);
  }

  @Mutation(() => CoachClass)
  async updateCoachClass(
    @Args('updateCoachClassInput') updateCoachClassInput: UpdateCoachClassInput,
    @Args('clubId') clubId: string,
  ): Promise<CoachClass> {
    return this.coachClassService.update(updateCoachClassInput.id, updateCoachClassInput, clubId);
  }

  @Mutation(() => Boolean)
  async removeCoachClass(@Args('id') id: string, @Args('clubId') clubId: string): Promise<boolean> {
    return this.coachClassService.remove(id, clubId);
  }
}
