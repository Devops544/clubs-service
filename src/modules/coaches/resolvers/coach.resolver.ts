import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { Coach } from '../entities/coach.entity';
import { CoachService } from '../services/coach.service';
import { CreateCoachInput } from '../dto/create-coach.input';
import { UpdateCoachInput } from '../dto/update-coach.input';
import { CoachQueryInput } from '../dto/coach-filter.input';

@Resolver(() => Coach)
export class CoachResolver {
  constructor(private readonly coachService: CoachService) {}

  @Mutation(() => Coach)
  async createCoach(@Args('createCoachInput') createCoachInput: CreateCoachInput): Promise<Coach> {
    return this.coachService.create(createCoachInput);
  }

  @Query(() => [Coach], { name: 'coaches' })
  async findAllCoaches(@Args('query') query: CoachQueryInput): Promise<Coach[]> {
    const result = await this.coachService.findAll(query);
    return result.data;
  }

  @Query(() => Int, { name: 'coachesCount' })
  async getCoachesCount(@Args('query') query: CoachQueryInput): Promise<number> {
    const result = await this.coachService.findAll(query);
    return result.total;
  }

  @Query(() => Coach, { name: 'coach' })
  async findOneCoach(@Args('id') id: string): Promise<Coach> {
    return this.coachService.findOne(id);
  }

  @Query(() => [Coach], { name: 'coachesByClub' })
  async findCoachesByClub(@Args('clubId') clubId: string): Promise<Coach[]> {
    return this.coachService.findByClubId(clubId);
  }

  @Query(() => [Coach], { name: 'coachesByService' })
  async findCoachesByService(
    @Args('serviceId') serviceId: string,
    @Args('clubId', { nullable: true }) clubId?: string,
  ): Promise<Coach[]> {
    return this.coachService.findByService(serviceId, clubId);
  }

  @Mutation(() => Coach)
  async updateCoach(@Args('updateCoachInput') updateCoachInput: UpdateCoachInput): Promise<Coach> {
    return this.coachService.update(updateCoachInput.id, updateCoachInput);
  }

  @Mutation(() => Boolean)
  async removeCoach(@Args('id') id: string): Promise<boolean> {
    return this.coachService.remove(id);
  }
}
